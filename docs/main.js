const myId = (new MediaStream).id;
console.log(`myId:${myId}`);
let stream = null;
const skywayApiKey = 'b5d5365a-02bb-4c13-9958-01be0a4c0867';
const roomName = 'hoge_fuga_piyo_sfu';
function appendVideo(stream) {
    const video = document.createElement('video');
    video.srcObject = stream;
    document.body.appendChild(video);
    video.play();
}
const constraints = {
    video: true
};
navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    console.log(`streamId:${stream.id}`);
    appendVideo(stream);
    const peer = new Peer(myId, {
        key: skywayApiKey 
    });
    peer.on('open', id => {
        myIdDisp.textContent = id;
        const room = peer.joinRoom(roomName, { mode: 'sfu', stream });
        room.on('stream', stream => {
            console.log(`room on stream peerId:${stream.peerId}`);
            appendVideo(stream);
            const dummyPeer = new Peer({ key: skywayApiKey });
            dummyPeer.on('open', _ => {
                const dummyRoom = dummyPeer.joinRoom(roomName, { mode: 'sfu' });
                dummyRoom.on('open', _ => dummyRoom.close());
                dummyRoom.on('close', _ => dummyPeer.destroy());
            });
            dummyPeer.on('error', err => console.error(err));
        });
    });
}).catch(err => {
    console.error(err);
});

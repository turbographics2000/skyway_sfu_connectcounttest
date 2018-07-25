const myId = (new MediaStream).id;
console.log(`myId:${myId}`);
let stream = null;
const skywayApiKey = '6116551f-321e-4a11-9cac-d2650671232a';
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
        const room = peer.joinRoom('hoge_fuga_piyo_sfu', { mode: 'sfu', stream });
        room.on('stream', stream => {
            console.log(`room on stream peerId:${stream.peerId}`);
            appendVideo(stream);
            const dummyPeer = new Peer({ key: skywayApiKey });
            dummyPeer.on('open', _ => {
                const dummyRoom = dummyPeer.joinRoom('hoge_fuga_piyo_sfu', { mode: 'sfu' });
                dummyRoom.on('open', _ => dummpyRoom.close());
                dummyRoom.on('close', _ => dummyPeer.destroy());
            });
            dummyPeer.on('error', err => console.error(err));
        });
    });
}).catch(err => {
    console.error(err);
});

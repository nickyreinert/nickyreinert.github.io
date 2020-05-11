function hostMultiPlayerSession() {

    // need to add stun server otherwise i get this error
    // >> ICE failed, add a STUN server and see about:webrtc for more details #470 
    var config = { 'iceServers': [{ 'urls': ['stun:stun.l.google.com:19302'] }] };
    
    var peer = new Peer(config);

    var multiPlayerLink = document.getElementById('multiPlayerLink');

    multiPlayerLink.value = "Please wait...";

    peer.on('open', function(id) {

        multiPlayerLink.value = window.location + "?hostId=" + id;
        
    });

    peer.on('connection', function(conn) { 


        // Receive messages
        conn.on('data', function(data) {
            console.log('Received', data);
        });

        // Send messages
        conn.send('Hello!');

     });


}

function connectToHost(hostId) {

    var peer = new Peer(); 
    var conn = peer.connect(hostId);

    console.log(conn);
    conn.on('open', function() {
        // Receive messages
        conn.on('data', function(data) {
          console.log('Received', data);
        });
      
        // Send messages
        conn.send('Hello!');
      });

}
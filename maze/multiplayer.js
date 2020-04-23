function hostMultiPlayerSession() {

    var peer = new Peer(); 
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

    var conn = peer.connect('dest-peer-id');

    conn.on('open', function() {
        // Receive messages
        conn.on('data', function(data) {
          console.log('Received', data);
        });
      
        // Send messages
        conn.send('Hello!');
      });

}
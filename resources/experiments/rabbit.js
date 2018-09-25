var amqp = require('amqplib/callback_api');

amqp.connect('amqp://guest:guest@localhost:5672', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'msgs';
    var msg = 'Hello World!';

    ch.assertQueue(q, {durable: true});
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer(msg));

    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});

// todaycmscontent







var amqp = require('amqplib');

amqp.connect('amqp://localhost').then(function(conn) {
  return conn.createChannel().then(function(ch) {
    var ex = 'todaycmscontent';
    var ok = ch.assertExchange(ex, 'fanout', {durable: true})

    var message = process.argv.slice(2).join(' ') ||
      'info: Hello World!';

    return ok.then(function() {
      ch.publish(ex, 'live', Buffer.from(message));
      console.log(" [x] Sent '%s'", message);
      return ch.close();
    });
  }).finally(function() { conn.close(); });
}).catch(console.warn);























var amqp = require('amqp');

/*
var connection = amqp.createConnection({
    host: 'localhost',
    port: 5672,
    login: 'guest',
    password: 'guest'
});
*/

var connection = amqp.createConnection({url: "amqp://guest:guest@localhost:5672"});

// Local references to the exchange, queue and consumer tag
var _exchange = null;
var _queue = null;
var _consumerTag = null;

// Report errors
connection.on('error', function(err) {
    console.error('Connection error', err);
});

// Update our stored tag when it changes
connection.on('tag.change', function(event) {
    if (_consumerTag === event.oldConsumerTag) {
        _consumerTag = event.consumerTag;
        // Consider unsubscribing from the old tag just in case it lingers
        _queue.unsubscribe(event.oldConsumerTag);
    }
});

// Initialize the exchange, queue and subscription
connection.on('ready', function() {
    connection.exchange('todaycmscontentdirect', function(exchange) {
        _exchange = exchange;

        connection.queue('msgs', function(queue) {
            _queue = queue;

            // Bind to the exchange
            queue.bind('todaycmscontentdirect', 'live');

            // Subscribe to the queue
            queue
                .subscribe(function(message) {
                    // Handle message here
                    console.log('Got message', message);
                    queue.shift(false, false);
                })
                .addCallback(function(res) {
                    // Hold on to the consumer tag so we can unsubscribe later
                    _consumerTag = res.consumerTag;
                })
            ;
        });
    });
});

// Some time in the future, you'll want to unsubscribe or shutdown
setTimeout(function() {
    if (_queue) {
        _queue
            .unsubscribe(_consumerTag)
            .addCallback(function() {
                // unsubscribed
            })
        ;
    } else {
        // unsubscribed
    }
}, 60000);


/*
var exc = connection.exchange('todaycmscontentdirect', function (exchange) {
  console.log('Exchange ' + exchange.name + ' is open');
});
*/


/* */
var q = connection.queue('msgs', function (queue) {
  console.log('Queue ' + queue.name + ' is open');
});


          function getArray(){
                return $.getJSON('import_to_vivagraph01_l50.json');
          }
            function onLoad() {
                var list=[];

                var g = Viva.Graph.graph();
                getArray().done(function(json){
                  $.each(json, function(sequence,dict_dist){
                    if (list.indexOf(sequence) < 0) {    //checks if sequence is not in list to prevent adding multiple nodes for each sequence
                      g.addNode(sequence,sequence);
                      list.push(sequence);
                      }
                      // loops between all arrays of array pairing sequence and distances
                    for (var i = 0; i < dict_dist.length; i++){
                      var pairs = dict_dist[i];
                      var reference = pairs[0];  //stores references in a unique variable
                      var distance = pairs[1];   //stores distances in a unique variable
                      if (list.indexOf(reference) < 0) {    //checks if reference is not in list to prevent adding multiple nodes for each sequence
                        g.addNode(reference,reference);
                        list.push(reference);
                      }
                      g.addLink(sequence,reference,distance);
                    };
                  });
                  // previously used to check the number of nodes provided
                  //console.log(list);

                  var layout = Viva.Graph.Layout.forceDirected(g, {
                      springLength : 30,
                      springCoeff : 0.0001,
                      dragCoeff : 0.01,
                      gravity : -1.2,
                      theta : 1
                  });

                  precompute(1000, renderGraph);

                  function precompute(iterations, callback) {
                      // let's run 10 iterations per event loop cycle:
                    var i = 0;
                    while (iterations > 0 && i < 10) {
                      layout.step();
                      iterations--;
                      i++;
                    }
                    //processingElement.innerHTML = 'Layout precompute: ' + iterations;
                    if (iterations > 0) {
                      setTimeout(function () {
                          //console.log(iterations);
                          precompute(iterations, callback);
                      }, 0); // keep going in next even cycle
                    } else {
                      // we are done!
                      callback();
                    }
                  }

                  function renderGraph(){
                      var graphics = Viva.Graph.View.webglGraphics();
                      var renderer = Viva.Graph.View.renderer(g, {
                          layout   : layout,
                          graphics : graphics,
                          container: document.getElementById('couve-flor')
                      });
                      //next we will change all node colors
                      renderer.run();

                      var events = Viva.Graph.webglInputEvents(graphics, g);
                        //change node color on overing, though it only functions without renderer.pause()
                        //events.mouseEnter(function (node) {
                        //  console.log('Mouse entered node: ' + node.id);
                        // var nodeUI = graphics.getNodeUI(node.id);
                        //  nodeUI.color = 0xFF69B4FF;
                        //});
                        // changes the color of node and links of this node when clicked
                        events.click(function (node) {
                          change_color=true;
                          console.log('Single click on node: ' + node.id);
                          var nodeUI = graphics.getNodeUI(node.id);
                          color_to_use=0x009ee8ff

                          if (nodeUI.color == color_to_use) {
                            default_link_color=nodeUI.color
                            color_to_use=[0xFF4500FF,0xFF4500FF];
                          }
                          else {
                            color_to_use=[0x009ee8ff,0xb3b3b3ff]; // resets the color of node and respective links if it was previously checked (on click)
                          }
                          nodeUI.color = color_to_use[0];
                          g.forEachLinkedNode(node.id, function(node, link){
                            var linkUI = graphics.getLinkUI(link.id);
                            linkUI.color=color_to_use[1];
                          });
                          renderer.rerender();
                        });
                        

                      renderer.rerender();
                      renderer.pause();
                  }
                  
                });

            }         
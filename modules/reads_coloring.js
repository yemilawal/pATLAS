// single read displayer
function read_coloring(g, graphics, renderer){
  var readColorArray=[];
  //console.log(read_json)
  var readString=read_json.replace(/[{}"]/g,'').split(",");
  for (string in readString){
    gi = readString[string].split(":")[0].replace(" ","");
    perc = parseFloat(readString[string].split(":")[1].replace(" ",""));
    if (document.getElementById('check_file').checked){
      read_color = chroma.mix('yellow', 'maroon', perc).hex().replace('#', '0x');
    }
    else{
      read_color = chroma.mix('lightsalmon', 'maroon', perc).hex().replace('#', '0x');
    }
    node_iter(read_color,gi,g,graphics);
  };
  // control all related divs
  showRerun = document.getElementById('Re_run'); 
  showGoback = document.getElementById('go_back'); 
  showDownload = document.getElementById('download_ds'); 
  showRerun.style.display = "block";
  showGoback.style.display = "block";
  showDownload.style.display = "block";
  renderer.rerender();
  $("#loading").hide();
};

// function to iterate through nodes
function node_iter(read_color,gi,g,graphics){
  g.forEachNode(function (node) {
    nodeGI=node.id.split("_").slice(0,2).join("_");
    var nodeUI = graphics.getNodeUI(node.id);
    if (gi == nodeGI){
      nodeUI.color = read_color;
      nodeUI.backupColor = nodeUI.color;
    }
  });
}

///////////////////
// link coloring //
///////////////////

function link_color(g, graphics, renderer){
  g.forEachLink(function(link){
    var dist = link.data*10
    var linkUI = graphics.getLinkUI(link.id)
    link_color = chroma.mix('#CAE368', '#65B661', dist).hex().replace('#', '0x') + "FF";
    // since linkUI seems to use alpha in its color definition we had to set alpha to 100% 
    //opacity by adding "FF" at the end of color string
    linkUI.color = link_color
  });
  renderer.rerender();
  $("#loading").hide();
}
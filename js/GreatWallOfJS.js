

	  let ripple_in_effect = document.createElement("style");
	  let ripple_out_effect = document.createElement("style");
	document.head.appendChild(ripple_in_effect);
	document.head.appendChild(ripple_out_effect);

let request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body);
    });
};


function getParentNodeIndex(nodes,nodeName)
{
	for(let i = 0; i < nodes.length; i++)
	{
		if(nodeName == nodes[i])
		{
				return i;
		}
	}
	
	return 0;
}	


	let dirty  = true;

	/*for (var i = 0; i < inputs.length; i++) {
	  inputs[i].addEventListener("change", layout);
	} */


	let nodes  = document.querySelectorAll(".item");
	let total  = nodes.length;
	let boxes  = [];
	let time   = 0.7;
	let omega  = 7;
	let zeta   = 0.9999;//0.9;
	let beta  = 0.014141782065918275;//just hardcode it for now, orig eiqaution is listed to the right//Math.sqrt(1.0 - zeta * zeta);

//debounce for smoothness during easing callback...
function debounce(fn, threshold) {
  var timeout;
  return function debounced() {
    if ( timeout ) {
      clearTimeout( timeout );
    }
    function delayed() {
      fn();
      timeout = null;
    }
    timeout = setTimeout( delayed, threshold || 100 );
  }
}

window.addEventListener("resize", debounce(function() { dirty = true;},10) );
TweenLite.ticker.addEventListener("tick", () =>  dirty && layout());



function ease(progress) {
  progress = 1 - Math.cos(progress * Math.PI / 2);   
  progress = 1 / beta * 
    Math.exp(-zeta * omega * progress) * 
    Math.sin( beta * omega * progress + Math.atan(beta / zeta));
  return 1 - progress;
}

function layout() {
  
  dirty = false;
  for (let i = 0; i < total; i++) {
    
    let box = boxes[i];
        
    let lastX = box.x;
    let lastY = box.y;   
       
    let lastW = box.width;
    let lastH = box.height;     
    
    let width  = box.width  = box.node.offsetWidth;
    let height = box.height = box.node.offsetHeight;
    
    box.x = box.node.offsetLeft;
    box.y = box.node.offsetTop;      
        
    if (lastX !== box.x || lastY !== box.y) {
      
      let x = box.transform.x + lastX - box.x;
      let y = box.transform.y + lastY - box.y;  
      
      // Tween to 0 to remove the transforms
      TweenLite.set(box.node, { x, y });
      TweenLite.to(box.node, time, { x: 0, y: 0, ease });
    }
        
    if (lastW !== box.width || lastH !== box.height) {      
      TweenLite.to(box.content, time, { autoRound: false, width, height, ease });      
    }
  }  
}


//Function to convert rgb color to hex format
function rgb2hex(rgb) {
 
 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 
 //if rgb is null  (intial??? where is this coming from?) / close to black...
 if(rgb == null) return "#4CAF50";
 
 return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

let hexDigits = new Array ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
 }
 
 
 function addHexColor(c1, c2) {
	 
	 if(c1.includes('#'))
	 {
		 c1 = c1.split("#")[1]
	 }
	 if(c2.includes('#'))
	 {
		 c2 = c2.split("#")[1]
	 }
	 //alert(c1);
  let hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
  while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
  return "#" + hexStr;
}

let close_enough_to_white = new Set(["#102ee4a","#ffffff","#1039142","#10b4720","#1064456","#10298f3","#10d85c2","#111350b","#1067b5e","#103461a"]);

//can keep an array of sleected ids here in this function below (depending if multiselect is true or false...)...
function onButtonBrickSelected(id)
{
	//alert(id[0].style["borderColor"]);
	
	let flex_container = document.getElementById(id[0].flex_container_id);
	 
	let elem = id[1];//document.getElementById(id[0].id);
	
	if( flex_container.multiSelect != "true")
	{ 
		//deselect all buttons  // flex_container.multiSelect
		for(let z = 0; z < id[0].parentNode.parentNode.childNodes.length; z++)
		{
			let childNode = id[0].parentNode.parentNode.childNodes[z].childNodes[1].childNodes[0];
			if(elem.id != childNode.id && childNode.classList.contains(id[0].cssSelected) )
				//alert(id[0].parentNode.parentNode.childNodes[z].classList);
			{
				childNode.classList.remove(id[0].cssSelected);
				
				childNode.style["background-color"] = childNode.color_preserved;
				
				/// make a similar case here, except check if selected above...
				if(!childNode.classList.contains("ripple-out"))
				{ 
					ripple_out_effect.innerHTML = ".ripple-out:before {border-color: "+ childNode.style["border-color"] +";}";
					childNode.className = "ripple-out" + " " + childNode.className;  
				}
				//timeout after 1 second... (must match css...)
				setTimeout(function() { 

					if(childNode.classList.contains("ripple-out"))
					{
						childNode.classList.remove("ripple-out");
					}
					
				}, 200);
				
			}
			else if(elem.id == childNode.id)
			{
				ripple_out_effect.innerHTML = ".ripple-out:before {border-color: "+id[1].style["border-color"] +";}";
			}
		}
	}
	
	ripple_in_effect.innerHTML = ".ripple-in:before {border-color: "+id[1].style["border-color"] +";}";

		let ripple_effect = "ripple-out";
		
		if(!elem.classList.contains(id[0].cssSelected))
		{
			elem.className += " " + id[0].cssSelected; 
			elem.classPreserved = elem.className;
			ripple_effect = "ripple-in";
			
			//alert(rgb2hex(id[1].style["borderColor"]));
			
			//alert( addHexColor( rgb2hex(id[1].style["borderColor"] ),"111111") );
			elem.color_preserved = elem.style["background-color"];
			let addhex = "114034";//"111111";//114034";
			let added_colors = addHexColor( rgb2hex(elem.style["border-color"]),addhex); 
			//alert(added_colors);
			if(close_enough_to_white.has(added_colors) )
				elem.style["background-color"] = elem.style["border-color"];
			else 
				elem.style["background-color"] = added_colors;
			//id[1].style["borderColor"];
			//alert(id[1].style["background-color"] );
		}
		// don't need this case for non-multiselect, as if the same button is selected, we don't want to de-select it// else //
		else if( flex_container.multiSelect == "true")
		{
			ripple_out_effect.innerHTML = ".ripple-out:before {border-color: "+id[1].style["border-color"] +";}";
			elem.classList.remove(id[0].cssSelected);
			id[1].style["background-color"] = id[1].color_preserved;
		}
		
		
		/// make a similar case ehre, except check if selected above...
		if(!elem.classList.contains(ripple_effect))
		{
			elem.className = ripple_effect + " " + elem.className; 
		}
		//timeout after 1 second... (must match css...)
		setTimeout(function() { 

			if(elem.classList.contains(ripple_effect))
			{
				elem.classList.remove(ripple_effect);
				//elem.className = elem.classPreserved;
			}
			
		}, 200);

		
	
}

function getRuleWithSelector(selector) {
  var numSheets = document.styleSheets.length,
    numRules,
    sheetIndex,
    ruleIndex;
  // Search through the style sheets.
  for (sheetIndex = 0; sheetIndex < numSheets; sheetIndex += 1) {
    numRules = document.styleSheets[sheetIndex].cssRules.length;
    for (ruleIndex = 0; ruleIndex < numRules; ruleIndex += 1) {
      if (document.styleSheets[sheetIndex].cssRules[ruleIndex].selectorText === selector) {
        return document.styleSheets[sheetIndex].cssRules[ruleIndex];
      }
    }
  }
  // If we get this far, then the rule doesn't exist.
  // So the return value is undefined.
}



function onClickPlus(id)
{
	//let flex_container = document.getElementById(id.flex_container_id);
	 
	 //plus button clicked... (add to favroties / pop-up sidebar with more info about the comic...)
	 
	let elem = id[0];//document.getElementById(id[0].id);
	
	/*if( flex_container.multiSelect != "true")
	{ 
		//deselect all buttons  // flex_container.multiSelect
		for(let z = 0; z < id.parentNode.parentNode.childNodes.length; z++)
		{
			//gets the nubmer and appends it to the front for a unique I.D. for each of the "Plus" symbols...  
			let childNode = document.getElementById(id.parentNode.parentNode.childNodes[z].childNodes[1].childNodes[1].id);
			if(elem.id != childNode.id && childNode.classList.contains(id.cssSelected) )
				//alert(id[0].parentNode.parentNode.childNodes[z].classList);
			{ 
				childNode.classList.remove(id.cssSelected);
				
				/// make a similar case here, except check if selected above...
				if(!childNode.classList.contains("ripple-out"))
				{ 
					childNode.className = 
					"ripple-out" + " " + childNode.className;  
				}
				//timeout after 1 second... (must match css...)
				setTimeout(function() { 

					if(childNode.classList.contains("ripple-out"))
					{
						childNode.classList.remove("ripple-out");
					}
					
				}, 200);
				
			}
		}
	}*/
	 
	  //alert(id[0].style["border-color"]);
	  
	ripple_in_effect.innerHTML = ".ripple-in:before {border-color: "+id[1].style["border-color"] +";}";
	ripple_out_effect.innerHTML = ".ripple-out:before {border-color: "+id[1].style["border-color"] +";}";
	
	
	let ripple_effect = "ripple-out";
	
	if(!elem.classList.contains(id.cssSelected))
	{
		elem.className += " " + id.cssSelected; 
		elem.classPreserved = elem.className;
		ripple_effect = "ripple-out";//yes, this is done on purpose to always have the ripple out effect...
	}
	else
	{
		elem.classList.remove(id.cssSelected);
	}
	
	
	/// make a similar case ehre, except check if selected above...
	if(!elem.classList.contains(ripple_effect))
	{
		elem.className = ripple_effect + " " + elem.className; 
	}
	//timeout after 1 second... (must match css...)
	setTimeout(function() { 

		if(elem.classList.contains(ripple_effect))
		{
			elem.classList.remove(ripple_effect);
			//elem.className = elem.classPreserved;
		}
		
	}, 200);

	
	
}


function onButtonBrickHover()
{
	//alert(this.children.length);
	
	let elem = this;

	elem.style["z-index"] = "11";
	
	elem = this.children[1];
	if(!elem.classList.contains("grow"))
	{
		elem.classPreserved = elem.className;
		elem.className = "grow " + elem.className; 
	}
	
}

function onButtonBrickHoverOut()
{ 
	let elem = this;
		
	 
	elem.style["z-index"] = "0";
	
	elem = this.children[1];
	if(elem.classList.contains("grow"))
	{
		elem.classList.remove("grow");
		//elem.className = elem.classPreserved;
	}
}



function onButtonImgHover()
{
	
	//img transform
	let elem = this;
 
	if(!elem.classList.contains("grow"))
	{
		elem.classPreserved = elem.className;
		elem.className = "grow " + elem.className; 
	}
	
	//text/button transform
	/*let elem_child = this.parentNode.children[1];
	
	elem_child.style["transition"] = "0.45s cubic-bezier(0.47, 0, 0.745, 0.715)";
 
	if(!elem_child.classList.contains("grow"))
	{
		elem_child.classPreserved = elem_child.className;
		elem_child.className = "grow " + elem_child.className; 
	}*/
	//alert(this.parentNode.children[2].children);
	
	elem_child = this.parentNode.children[2];
	
	elem_child.style["transition"] = "0.45s cubic-bezier(0.47, 0, 0.745, 0.715)";
 
	if(!elem_child.classList.contains("grow"))
	{
		elem_child.classPreserved = elem_child.className;
		elem_child.className = "grow " + elem_child.className; 
	}
	
}

function onButtonImgHoverOut()
{ 
	let elem = this;
  
	//img transform
	if(elem.classList.contains("grow"))
	{
		elem.classList.remove("grow"); 
	}
	
	let elem_child = this.parentNode.children[2];
  
	//text/button transform
	if(elem_child.classList.contains("grow"))
	{
		elem_child.classList.remove("grow"); 
	}
}

function onImgSelected(id)
{
	let flex_container = document.getElementById(id.flex_container_id);
	 
	let elem = id;
	
	//alert("Img selected, goto homepage.");
}


function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

	function getRandFloatRange(min, max) {
		  return Math.random() * (max - min) + min;
		}
		
function getRandIntRange(min, max) 
{
		  min = Math.ceil(min);
		  max = Math.floor(max);
		  return Math.floor(Math.random() * (max - min)) + min;
}
		

function buildGreatWall(config_main,config_color,config_text,k,image_name_list)
{
		lines = config_text.split(/\//);
		
		currentlySelectedAlignIndex = k;
		
		
		if( config_main["HTMLNodes"][k]["properties"]["justify-content"] != null )
		{
			if(config_main["HTMLNodes"][k]["properties"]["display_type"] == "image")
			{
				let flex_container = document.createElement("div");
				flex_container.id = "alignContent" + k;
				flex_container.className = "flex-container " + config_main["HTMLNodes"][k]["properties"]["justify-content"];
				
				if( config_main["HTMLNodes"][k]["properties"]["multiSelect"] != null)
				{
					flex_container.multiSelect = config_main["HTMLNodes"][k]["properties"]["multiSelect"];
				}
					
				for(let z = 0; z < config_main["HTMLNodes"][k]["properties"]["num-elems"]; z++)
				{ 
					let item_brick_outer = document.createElement("div");
					
					item_brick_outer.className = "item" + " " + config_main["HTMLNodes"][k]["properties"]["className"];
					item_brick_outer.classPreserved = item_brick_outer.className;
					let item_brick_inner = document.createElement("div");
					
					let item_brick_img = document.createElement("img");
					//instead of item_brick innder, give item_brick_img item_brick_inner's ID...
					item_brick_img.id = config_main["HTMLNodes"][k]["DOM_name"] + z;
					
					if(config_main["HTMLNodes"][k]["properties"]["img_order"] == "rand")
					{
						item_brick_img.src = config_main["HTMLNodes"][k]["properties"]["img_dir"] + image_name_list[getRandIntRange(0,image_name_list.length)];
					}
					else
					{
						item_brick_img.src = config_main["HTMLNodes"][k]["properties"]["img_dir"] + image_name_list[z % image_name_list.length];
					}
					
					if(config_main["HTMLNodes"][k]["properties"]["css"][0]["img-padding"] != null)
					{
						item_brick_img.style.padding = config_main["HTMLNodes"][k]["properties"]["css"][0]["img-padding"];
					}
					
					//item_brick_inner.className = "item-content";
					item_brick_img.className = "item-content-img";
					
					if(config_main["HTMLNodes"][k]["properties"]["text_order"]  == "rand")
					{
						item_brick_inner.innerText = lines[getRandIntRange(0,lines.length)].trim();//z*9999999 + "\n" + z*9999999 + z*9999999 + "\n" + z*9999999 + z*9999999 + "\n" + z*9999999;
					}
					else
					{
						item_brick_inner.innerText = lines[z % lines.length].trim();//z*9999999 + "\n" + z*9999999 + z*9999999 + "\n" + z*9999999 + z*9999999 + "\n" + z*9999999;
					}
					
					//item_brick_inner.id = z + config_main["HTMLNodes"][k]["DOM_name"] + z;
					item_brick_inner.classPreserved = item_brick_inner.className;
					
					let item_brick_inner_plus = document.createElement("div");
					item_brick_inner_plus.id = config_main["HTMLNodes"][k]["DOM_name"] + z + "_" + z; // Note html IDs cannot start with numbers... use "underscore" instead
					item_brick_inner_plus.innerText = "+";//z*9999999 + "\n" + z*9999999 + z*9999999 + "\n" + z*9999999 + z*9999999 + "\n" + z*9999999;
					//item_brick_inner_plus.id = config_main["HTMLNodes"][k]["DOM_name"] + z;
					item_brick_inner_plus.classPreserved = item_brick_inner_plus.className;
					
					
					//for passing in params via onlick//document.getElementById( "myID" ).setAttribute( "onClick", "myFunction("+VALUE+");" );
					
					if( config_main["HTMLNodes"][k]["properties"]["mouseenter"] != null)
						item_brick_img.addEventListener("mouseenter", window[config_main["HTMLNodes"][k]["properties"]["mouseenter"]]);
					if( config_main["HTMLNodes"][k]["properties"]["mouseleave"] != null)
						item_brick_img.addEventListener("mouseleave", window[config_main["HTMLNodes"][k]["properties"]["mouseleave"]]);
					if( config_main["HTMLNodes"][k]["properties"]["cssSelected"] != null)
						item_brick_img.cssSelected = config_main["HTMLNodes"][k]["properties"]["cssSelected"];
					
						 
					
					for (var key in config_main["HTMLNodes"][k]["properties"]["css"][0]) 
					{
						if (config_main["HTMLNodes"][k]["properties"]["css"][0].hasOwnProperty(key)) 
						{
							if(key == "border")
							{ 
								//item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								item_brick_inner_plus.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
							}
							else if(key == "border-color")
							{
								if(config_main["HTMLNodes"][k]["properties"]["color_order"]  == "rand")
								{
									//item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
									item_brick_inner_plus.style[key] = config_color[config_main["HTMLNodes"][k]["properties"]["color_config"]][getRandIntRange(0,config_color[config_main["HTMLNodes"][k]["properties"]["color_config"]].length)];
								}
								else
								{
									item_brick_inner_plus.style[key] = config_color[config_main["HTMLNodes"][k]["properties"]["color_config"]][z % config_color[config_main["HTMLNodes"][k]["properties"]["color_config"]].length];
								}	
								
								//default boder color-> don't use, read in though config_color file item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
									
								/*if(z % 2 == 0)
								item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								else
								item_brick_inner.style[key] = "#aa00aa";*/
							}
							//same as line below...
							else if (key == "width")
							{
								let textWidth = getTextWidth(item_brick_inner.innerText,config_main["HTMLNodes"][k]["properties"]["font"]);
								if(textWidth < 40.0)
								{
									//item_brick_inner.style[key] = "50px";//config_main["HTMLNodes"][k]["properties"]["css"][0][key];
									//item_brick_outer.style[key] = "50px";//config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								}
							}
							else if(key == "img_width" || key == "img_height" )
							{
									let split_after = key.split("_");
									
									//split into csv: 100,100,px (unit) 
									
									item_brick_img.style[split_after[1]] = getRandFloatRange(parseFloat(config_main["HTMLNodes"][k]["properties"]["css"][0][key][0]),parseFloat(config_main["HTMLNodes"][k]["properties"]["css"][0][key][1])) + config_main["HTMLNodes"][k]["properties"]["css"][0][key][2];
							}
							else if (key == "height" || key == "width" )
							{
									//item_brick_outer.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
							}
							else if (key == "color" || key == "background-color")
							{ 
								item_brick_inner_plus.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								//item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								item_brick_outer.style[key] = "rgba(255,255,255,0.0)";
							}
							else if(key == "flex-flow")
							{								
								item_brick_outer.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								item_brick_outer.style["display"] = "flex";
							}
							//could use if key.cloantins "_"
							else if(key == "plus_padding" || key == "plus_margin")
							{
								//plus padding and margin
								
									let split_after = key.split("_");
									item_brick_inner_plus.style[split_after[1]] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
							}
							else
							{
								item_brick_inner_plus.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								item_brick_outer.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								//item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
							}
						}
					}
					
					for (var key in config_main["HTMLNodes"][k]["properties"]["css-text"][0]) 
					{
						if (config_main["HTMLNodes"][k]["properties"]["css-text"][0].hasOwnProperty(key)) 
						{
								item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css-text"][0][key];
						}
					}
					
					//make text-unslectable instide button:
					item_brick_outer.style["user-select"] = "none";
					//
					item_brick_inner.style["position"] = "relative";
					item_brick_inner_plus.flex_container_id = flex_container.id;
					item_brick_inner.appendChild(item_brick_inner_plus); // 1 -> 1 
					item_brick_outer.appendChild(item_brick_img); // 0
					item_brick_outer.appendChild(item_brick_inner); // 1
					//add item item_brick_plus
					flex_container.appendChild(item_brick_outer);
					
					flex_container.children[z].children[0].flex_container_id = flex_container.id;
					
					if( config_main["HTMLNodes"][k]["properties"]["onClick"] != null)
						item_brick_img.setAttribute("onClick", config_main["HTMLNodes"][k]["properties"]["onClick"]+"("+flex_container.children[z].children[0].id+");" );
					if( config_main["HTMLNodes"][k]["properties"]["onClickPlus"] != null)
					{
						item_brick_inner_plus.function_click_preserved = config_main["HTMLNodes"][k]["properties"]["onClickPlus"]+"("+flex_container.children[z].children[0].id+"_"+z+");"; // .setAttribute("onClick", config_main["HTMLNodes"][k]["properties"]["onClickPlus"]+"("+flex_container.children[z].children[0].id+"_"+z+");" );
					}
					
				}
				document.getElementById(config_main["HTMLNodes"][k]["DOM_name"]).appendChild(flex_container);
			}
			else
			{
				let flex_container = document.createElement("div");
				flex_container.id = "alignContent" + k;
				flex_container.className = "flex-container " + config_main["HTMLNodes"][k]["properties"]["justify-content"];
				
				if( config_main["HTMLNodes"][k]["properties"]["multiSelect"] != null)
				{
					flex_container.multiSelect = config_main["HTMLNodes"][k]["properties"]["multiSelect"];
				}
					
				for(let z = 0; z < config_main["HTMLNodes"][k]["properties"]["num-elems"]; z++)
				{ 
					let item_brick_outer = document.createElement("div");
					
					item_brick_outer.className = "item" + " " + config_main["HTMLNodes"][k]["properties"]["className"];
					item_brick_outer.classPreserved = item_brick_outer.className;
					let item_brick_inner = document.createElement("div");
					
					item_brick_inner.className = "item-content";
					
					if(config_main["HTMLNodes"][k]["properties"]["text_order"]  == "rand")
					{
						item_brick_inner.innerText = lines[getRandIntRange(0,lines.length)].trim();//z*9999999 + "\n" + z*9999999 + z*9999999 + "\n" + z*9999999 + z*9999999 + "\n" + z*9999999;
					}
					else
					{
						item_brick_inner.innerText = lines[z % lines.length].trim();//z*9999999 + "\n" + z*9999999 + z*9999999 + "\n" + z*9999999 + z*9999999 + "\n" + z*9999999;
					}
					
					item_brick_inner.id = config_main["HTMLNodes"][k]["DOM_name"] + z;
					item_brick_inner.classPreserved = item_brick_inner.className;
					
					//for passing in params via onlick//document.getElementById( "myID" ).setAttribute( "onClick", "myFunction("+VALUE+");" );
					
					if( config_main["HTMLNodes"][k]["properties"]["mouseenter"] != null)
						item_brick_outer.addEventListener("mouseenter", window[config_main["HTMLNodes"][k]["properties"]["mouseenter"]]);
					if( config_main["HTMLNodes"][k]["properties"]["mouseleave"] != null)
						item_brick_outer.addEventListener("mouseleave", window[config_main["HTMLNodes"][k]["properties"]["mouseleave"]]);
					if( config_main["HTMLNodes"][k]["properties"]["cssSelected"] != null)
						item_brick_inner.cssSelected = config_main["HTMLNodes"][k]["properties"]["cssSelected"];
					
						 
					
					for (var key in config_main["HTMLNodes"][k]["properties"]["css"][0]) {
						if (config_main["HTMLNodes"][k]["properties"]["css"][0].hasOwnProperty(key)) 
						{
							if(key == "border")
							{ 
								item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
							}
							else if(key == "border-color")
							{
								if(config_main["HTMLNodes"][k]["properties"]["color_order"]  == "rand")
								{
									//item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
									//some colors are not good when added, see add hex colro funciton above, may need to cut out some colros from the modern palette "safe" (test colors indivisually) or may need to threshold / cap colors, 
									item_brick_inner.style[key] = config_color[config_main["HTMLNodes"][k]["properties"]["color_config"]][getRandIntRange(0,config_color[config_main["HTMLNodes"][k]["properties"]["color_config"]].length)];
								}
								else
								{
									item_brick_inner.style[key] = config_color[config_main["HTMLNodes"][k]["properties"]["color_config"]][z % config_color[config_main["HTMLNodes"][k]["properties"]["color_config"]].length];
								}	
								
								//default boder color-> don't use, read in though config_color file item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
									
								/*if(z % 2 == 0)
								item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								else
								item_brick_inner.style[key] = "#aa00aa";*/
							}
							//same as line below...
							else if (key == "width")
							{
								let textWidth = getTextWidth(item_brick_inner.innerText,config_main["HTMLNodes"][k]["properties"]["font"]);
								if(textWidth < 40.0)
								{
									//item_brick_inner.style[key] = "50px";//config_main["HTMLNodes"][k]["properties"]["css"][0][key];
									//item_brick_outer.style[key] = "50px";//config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								}
							}
							else if (key == "height")
							{
									item_brick_outer.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								
							}
							else if (key == "color" || key == "background-color")
							{
								
								item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								item_brick_outer.style[key] = "rgba(255,255,255,0.0)";
							}
							else
							{
								item_brick_outer.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
								item_brick_inner.style[key] = config_main["HTMLNodes"][k]["properties"]["css"][0][key];
							}
						}
					}
					
					//make text-unslectable instide button:
					item_brick_outer.style["user-select"] = "none";
					
					item_brick_outer.appendChild(item_brick_inner);
					flex_container.appendChild(item_brick_outer);
					
					flex_container.children[z].children[0].flex_container_id = flex_container.id;
					
					if( config_main["HTMLNodes"][k]["properties"]["onClick"] != null)
						item_brick_inner.setAttribute("onClick", config_main["HTMLNodes"][k]["properties"]["onClick"]+"("+flex_container.children[z].children[0].id+");" );
					
					 
				}
				document.getElementById(config_main["HTMLNodes"][k]["DOM_name"]).appendChild(flex_container);
			}
			
		}
		
		return new Promise((resolve, reject) => { 
		setTimeout(() => {
			resolve();
		}, 300);
		});
}
		
function prepareBricksForGreatWall(config_main, config_color)
{
	//for each html node
	
	for(let k = 0; k < config_main["HTMLNodes"].length; k++)
	{
		if( config_main["HTMLNodes"][k]["parent"] != null)
		{
			let props = config_main["HTMLNodes"][ getParentNodeIndex(config_main["HTMLNodes"],config_main["HTMLNodes"][k]["parent"]) ]["properties"];
			for (let key in props) 
			{
					if(config_main["HTMLNodes"][k]["properties"][key] == null)
						config_main["HTMLNodes"][k]["properties"][key] = props[key];
			}
		}
		
		if( config_main["HTMLNodes"][k]["properties"][ "text_dir" ] != null )
		{			
			request({url: ".\\" +  config_main["HTMLNodes"][k]["properties"]["text_dir"] + supported_languages.get(selected_language_name) + "\\script.md"})
			.then(config_text => {
								
				if( config_main["HTMLNodes"][k]["properties"][ "img_dir" ] != null )
				{			
					request({url: ".\\" +  config_main["HTMLNodes"][k]["properties"]["img_dir"] })
					.then(config_img => {
						
						let parser=new DOMParser();
						let htmlDoc=parser.parseFromString(config_img, "text/html");
						let script_elems = htmlDoc.getElementsByTagName('script');
						let re = /,".*(.jpg|.png|.ogv|.mp4)/; // /\(".*.js","/;
							
						//if we find matching filenames in the directory's inner html...
						
						let image_name_list = []
						
						for(var i = 0; i < script_elems.length; i++)
						{
							//regex 1: addRow("
							//regex 2: .js"
							let str = script_elems[i].innerHTML;
							//matches img files .jpg .png
							let found = str.match(re);
							if(found !== undefined && found !== null)
							{
								 var image_name = found[0].substring(2,found[0].length-4);
								 var image_name_with_extension = found[0].substring(2,found[0].length);
								 
								image_name_list.push(image_name_with_extension);
							} 
						}
						
						
						buildGreatWall(config_main, config_color, config_text,k,image_name_list);
					})
					.catch(error => {
						console.log(error);
					});
				}
				else
				{
					buildGreatWall(config_main, config_color, config_text,k);
				}
				
			})
			.catch(error => {
				console.log(error);
			});
		}
		
		
	}
	 
	
	 return new Promise(function (fulfilled, rejected) {

        let name = "John Doe";
		/// button arrangement bug, will go away in serve once callbacks are set to sequential.
        // wait 3000 milliseconds before calling fulfilled() method
        setTimeout ( 
            function() {
                fulfilled( name )
            }, 
            500
        )

    })
	
}

document.addEventListener('DOMContentLoaded', function(e)
//window.onload = function () 
{
	request({url: "./json/config_color.json"})
    .then(data_color => {
		let config_color = JSON.parse(data_color);
		request({url: "./json/config_main.json"})
		.then(data => {
			let config_main = JSON.parse(data);
			prepareBricksForGreatWall(config_main, config_color).then(
			text_data => {
				
				updateAnimationWall();
				layout();
			
			})
			
		})
		.catch(error => {
			console.log(error);
		});
    })
    .catch(error => {
        console.log(error);
    });
});


function changeFlex(e, t) {
  for (var n = document.querySelectorAll("." + e), l = document.querySelector("#" + t), r = 0; r < n.length; r++) n[r].addEventListener("change", function() {
    var e = this.value;
    l.setAttribute("class", "flex-container " + e)
  }, !1)
}

function changeItemFlex(e, t) {
  for (var n = document.querySelectorAll("." + e), l = document.querySelector("#" + t), r = 0; r < n.length; r++) n[r].addEventListener("change", function() {
    var e = this.value;
    l.setAttribute("class", "item " + e)
  }, !1)
}

function changeFlexBasis(e, t) {
  var n = isNaN(e.value) ? 0 : e.value;
  document.querySelector("#" + t).style.WebkitFlexBasis = n + "%", document.querySelector("#" + t).style.flexBasis = n + "%"
}

function changeFlexGrow(e, t) {
  var n = isNaN(e.value) ? 0 : e.value;
  document.querySelector("#" + t).style.WebkitFlexGrow = n, document.querySelector("#" + t).style.flexGrow = n
}

function changeFlexShrink(e, t) {
  var n = isNaN(e.value) ? 0 : e.value;
  document.querySelector("#" + t).style.WebkitFlexShrink = n, document.querySelector("#" + t).style.flexShrink = n
}

function changeFlexOrder(e, t) {
  var n = isNaN(e.value) ? 0 : e.value;
  document.querySelector("#" + t).style.WebkitOrder = n, document.querySelector("#" + t).style.order = n
}

var currentlySelectedAlignIndex = 0;

function changeAll(e, t, n, l) {
  changeFlexBasis(e, l), changeFlexGrow(t, l), changeFlexShrink(n, l)
}
for (var items = document.querySelectorAll(".item"), i = 0; i < items.length; i++)
  if (items[i].hasAttribute("data-color")) {
    var color = items[i].getAttribute("data-color");
    items[i].style.backgroundColor = "#" + color
  }
for (var flexO = document.querySelectorAll(".flex-order"), o = 0; o < flexO.length; o++) flexO[o].addEventListener("change", function() {
  changeFlexOrder(this, "order" + this.id)
}, !1);
changeFlex("flex-direction", "direction"), 
changeFlex("flex-wrap", "wrap"), 
changeFlex("flex-align-items", "align"), 
changeFlex("justify-content", "justify"),
changeFlex("align-content"+ currentlySelectedAlignIndex, "alignContent" + currentlySelectedAlignIndex), 
changeItemFlex("align-self", "alignSelf");
for (var flexGrow = document.querySelectorAll(".flex-grow"), i = 0; i < flexGrow.length; i++) flexGrow[i].addEventListener("change", function() {
  var e = "item" + this.id;
  changeFlexGrow(this, e)
});
for (var flexShrink = document.querySelectorAll(".flex-shrink"), j = 0; j < flexShrink.length; j++) flexShrink[j].addEventListener("change", function() {
  var e = "item" + this.id;
  changeFlexShrink(this, e)
});


function updateAnimationWall()
{
	//
	// ANIMATIONS -> rmember, these add cloned children, be careful with animations
	// ===========================================================================
	//var inputs = document.querySelectorAll("input");
	nodes = document.querySelectorAll(".item");
	total = nodes.length;
	
	for (let i = 0; i < total; i++) {
	  let node   = nodes[i];  
	  let width  = node.offsetWidth;
	  let height = node.offsetHeight;    
	  let color  = "transparent";    
		
	  // Need another element to animate width & height... use clone instead of editing HTML
	  let content = node.cloneNode(true);
	  if(!content.classList.contains("image_button"))
	  {
		content.classList.add("item-content");
		if (content.firstChild){
			//alert(node.children.length)
			node.children[0].style.display = "hidden";
			content.children[0].style.display = "hidden";
			//content.removeChild(content.firstChild);
		}
	  }
	  else
	  {
		  //specific cases for image-wall children...
		  content.classList.add("item-content-img-anim");
		//content.classList.add("item-content-img");
		//alert(content.children.length);
		
		if (content.firstChild) {
			//content.children[0].style.display = "none";
			content.children[0].style.visibility = "hidden";
			//content.removeChild(content.firstChild);
			
			//1) set node clone's (content) onclick attribute here, transfer ID over from above to cloned node here (neat trick!):
			//alert(node.children[1].children[0].getAttribute("onClick"));
			
			//alert(node.children[1].getAttribute("onClick"));
			content.children[1].id = node.children[1].children[0].id;
			content.children[1].setAttribute("onClick",node.children[1].children[0].function_click_preserved);
			//2) set visibility or node to hidden here, turnoff onlcick
			node.children[1].children[0].setAttribute("onClick","");
			node.children[1].children[0].id = "";
			node.children[1].style.visibility = "hidden";
			//node.setAttribute("onClick","");
		}
		
	  }
	  
	  TweenLite.set(node, { x: "+=0" });
	  TweenLite.set(content, { width, height });  
	  TweenLite.set([node, node.children], { backgroundColor: color, color });
	  
	  node.appendChild(content);
	  
	  let transform = node._gsTransform;
	  let x = node.offsetLeft;
	  let y = node.offsetTop;
	  
	  boxes[i] = { content, height, node, transform, width, x, y };
	} 
}


//make it so that you can linkto multiple directories... depeding on the directory you choose.
//script_directory in json file
 
var supported_languages = new Map([["English", "en"], ["日本語", "jp"], ["한글", "kr"]]);
var selected_language_name = "English";

function getFileOrDirectoryFromServer(url, filetype, doneCallback){
   var promiseObj = new Promise(function(resolve, reject){
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
	  
	  xhr.send();

      xhr.onreadystatechange = function(){
      if (xhr.readyState === 4){
         if (xhr.status === 200){
            //console.log("xhr done successfully");
            var resp = xhr.responseText;
            var respJson;
			if(filetype.toLowerCase() == "xml")
			{
				doneCallback($($.parseXML(resp)));
			}
			else if(filetype.toLowerCase() == "string")
			{
				doneCallback(resp);
			}
			else //JSON
			{
				respJson = JSON.parse(resp);
				doneCallback(respJson);
			}
         } else {
            reject(xhr.status);
            //console.log("xhr failed");
         }
      } else {
         //console.log("xhr processing going on");
      }
   }
   //console.log("request sent succesfully");
 });
 return promiseObj;
}

chrome.runtime.onInstalled.addListener(function() {
      chrome.storage.sync.set({arr: []});
  }); 

var ques_array=[];
var is_busy=false;
var badge=0;
function checker(item)
{
  //console.log(item);
  getResult(item);
  //if(!item.fl)
   // var id=setInterval(getResult,4000,item);
  while(is_busy){}
  is_busy=true;
  var i=ques_array.indexOf(item);
  ques_array.splice(i,1);
  chrome.storage.sync.set({arr: ques_array});
  is_busy=false;
}

function getResult(ques)
{
  $.ajax({url:"https://www.codechef.com/get_submission_status/"+ques.id+"/",
			dataType:"json",
			success:function(r){
						if(r.result_code!="wait"){
              badge++;
              chrome.browserAction.setBadgeText({text: String(badge)});
						  s=r.result_code;
							var n=r.time;
              var a=r.score;

              var op={
                type: "list",
                title: "undefined",
                message: "",
                items: [{title: "Problem: ", message: ques.qname}]
              }

							switch(s){
                case"partial_accepted": op.title="Partially Accepted!!";
                                        op.items.push({title: "Score: ", message: String(a)});
                                        op.items.push({title: "Time: ", message: String(n)+"s"}); 
                                        op.iconUrl="/images/pcorrect_chef_128.png"; break;
								
								case"accepted":			    op.title="Accepted!!";
                                        op.items.push({title: "Score", message: String(a)});
                                        op.items.push({title: "Time", message: String(n)+"s"});  
                                        op.iconUrl="/images/correct_chef_128.png"; break;

								case"wrong":		        op.title="Wrong!!";
                                        op.items.push({title: "Score", message: String(a)});
                                        op.items.push({title: "Time", message: String(n)+"s"});
                                        op.iconUrl="/images/wrong_chef_128.png";  break;

                case"time":				      op.title="Time Limit Exceeded!!";
                                        op.iconUrl="/images/wrong_chef_128.png";  break;

                case"runtime":			    op.title="Runtime Error!!";  
                                        op.iconUrl="/images/wrong_chef_128.png"; break;
                
								case"compile":		      op.title="Compilation Error!!";  
                                        op.iconUrl="/images/wrong_chef_128.png"; break;

                case"score":		        op.title="Insufficient Score!!";  
                                        op.iconUrl="/images/wrong_chef_128.png"; break;

                case"error":			      op.title="Internal Error!!";  
                                        op.iconUrl="/images/wrong_chef_128.png"; break;
              }
    
              chrome.notifications.create(String(ques.id),op);              
      }
      else
        setTimeout(getResult,2000,ques);
    }
  })
}

chrome.runtime.onStartup.addListener(function(){
  badge=0;
  chrome.storage.sync.get(['arr'],function(result){
    ques_array=result.arr;
    if(ques_array.length!=0)
    {
      is_busy=true;
      ques_array.forEach(function(item,index){
        setTimeout(checker,1000,item);
       })
      is_busy=false;
    }
  })
});

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
  //console.log(request.entry)
  while(is_busy){}
  is_busy=true;
  ques_array.push(request.entry);

  chrome.storage.sync.set({arr: ques_array});
  is_busy=false;
  setTimeout(checker,500,request.entry);
})

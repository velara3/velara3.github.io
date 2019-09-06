function onloadHandler(event = null) {
   var reg = /[?|&]l=([^&]+)/;
   var found = reg.exec(window.location.href);
   var messageSpan = document.getElementById("url");
   var clipboardLink = document.getElementById("clipboardLink");
   
   // if text parameter is found auto fill
   if (found!=null) {
      var value = deurl(found[1]);
      var isMac = navigator.platform.toLowerCase().indexOf("mac")!=-1;
      var protocol = "";

      if (isMac) {
         protocol = "file://";
      }

      if (isMac==false && value.indexOf("/")==0) {
         value = value.substr(1);
      }

      if (value) {
         messageSpan.textContent = value;
         messageSpan.title = value;
      }
      
      clipboardLink.addEventListener("click", function() {
         var message = "The URL is copied to the clipboard. Now paste it into the address bar and press enter."
         
         try {
            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
               navigator.clipboard.writeText(value);
               showMessage(message);
            }
            else if (window.clipboardData && window.clipboardData.setData) {
               clipboardData.setData("Text", value);
               showMessage(message);
            }
            else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
               var textarea = document.createElement("textarea");
               textarea.textContent = value;
               textarea.style.position = "absolute";
               textarea.style.top = 0;
               textarea.style.left = 0;
               document.body.appendChild(textarea);
               textarea.select();

               try {
                  document.execCommand("copy");
                  document.body.removeChild(textarea);
                  showMessage(message);
               }
               catch (error) {
                  showMessage("Copy to clipboard not supported: " + error);
               }
            }
         }
         catch(error) {
            showMessage("Copy to clipboard not supported", error);
         }

         return true;
      })
   }
}

function deurl(value) {
   var time = value.charAt(0);
   var newValue = "";
   var char = "";
   var charCode = 0;
   var charCodeT = 0;

   value = decodeURIComponent(value.substr(1));

   for (var i = 0; i < value.length; i++) {
      char = value[i];
      charCode = value.charCodeAt(i);
      charCodeT = charCode - time;
      newValue += String.fromCharCode(charCodeT);
   }

   return newValue;
}

function showMessage(message) {
   var messageLabel = document.getElementById("messageLabel");
   var previousMessage = messageLabel.textContent;
   var messageDuration = 5000;

   messageLabel.textContent = message;

   var timeout1 = setTimeout(function() {
      messageLabel.textContent = previousMessage;
   }, messageDuration);
}

//window.addEventListener("load", onloadHandler);
document.addEventListener("DOMContentLoaded", onloadHandler);
  let loadJS = function(url, location, implementationCode){
      //url is URL of external file, implementationCode is the code
      //to be called from the file, location is the location to
      //insert the <script> element
      let scriptTag = document.createElement('script');
      scriptTag.src = url;
      if (typeof implementationCode === "function") {
        scriptTag.onload = implementationCode;
        scriptTag.onreadystatechange = implementationCode;
      }
      location.appendChild(scriptTag);
  };




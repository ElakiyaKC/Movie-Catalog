function initialize () {
}

function sendRequest () {
	var movie_title=""
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("form-input").value);
   xhr.open("GET", "proxy.php?method=/3/search/movie&query=" + query,true);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
		  if(json.results.length==0){
			  alert("Movie details not available");
		  } 
		  else{
			  //Retrieve the movie is and movie title from JSON object
			  for(var i in json.results){
				  //document.getElementById("movies").innerHTML +="<li id='"+json.results[i].id+"'><a href='proxy.php?method=/3/movie/"+json.results[i].id+"'>"+json.results[i].original_title+"</a></li>";
				document.getElementById("movies").innerHTML +="<li id='"+json.results[i].id+"'>"+json.results[i].original_title+"</li>"
				document.getElementById("dates").innerHTML +=json.results[i].release_date+"<br>";
				}
				//make the list clickable and send its id and movie name
				var l = document.getElementById('movies').getElementsByTagName('li');
				for (var j=0; j<l.length; j++){
					l[j].addEventListener('click', function() {movieDetails(this.id);},false);
			}
			}
	   } 
   };
   xhr.send();
}



//function to extract the movie details
function movieDetails(movId)
{
	var movieId=movId;
   var xhr = new XMLHttpRequest();
   var query1 = encodeURI(movieId);
   var gid=[];
   var gname=[];
   var genredetails=[];
   xhr.open("GET", "proxy.php?method=/3/movie/"+query1,true);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
           var json = JSON.parse(this.responseText);
		   //extract the poster path,overview,genres and title
			var path=json.poster_path;
			var movie_title=json.original_title;
			for (var i in json.genres){    
		    gid.push([json.genres[i].id]);
			gname.push([json.genres[i].name]);
			}
			var summary=json.overview;
			document.getElementById("title").innerHTML= "Title:"+movie_title;
			if(gid.length==0){document.getElementById("genres").innerHTML="Genres:Genre id is not availabe for this movie";}
			else{document.getElementById("genres").innerHTML="Genres:"+ gid;}
			document.getElementById("Summary").innerHTML= "Overview:"+summary;
			if(path==null){
				document.getElementById("pic").src="http://vignette2.wikia.nocookie.net/robloxiwood/images/1/15/No_Poster.png/revision/latest?cb=20131213232449";
			}
			else{
				document.getElementById("pic").src="https://image.tmdb.org/t/p/w500"+path;
			}
			//calling function to extract credits details
			crewDetails(movieId);
   } 
   };
    xhr.send();
}


function crewDetails(movieId)
{ 	var reqId=movieId;
   var xhr = new XMLHttpRequest();
   var query = encodeURI(reqId);
   var crewDets=[];
   xhr.open("GET", "proxy.php?method=/3/movie/"+query+"/credits",true);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
           var json = JSON.parse(this.responseText);
			if(json.cast.length==0)
			{//document.getElementById("crew").innerHTML= "No crew details available";
			alert("Crew details not available for this movie");}
			for(var i in json.cast){
				if(crewDets.length<5){
				crewDets.push([json.cast[i].name]);
				}
				else break;
			}
			document.getElementById("crew").innerHTML= "Crew:"+crewDets;
				
   } 
   };
    xhr.send();
}
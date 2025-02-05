let BlogService = {
    fetchBlogsFromFile : function(){

      RestClient.get('blogs.json', function(data){
        let html = "";
              data.forEach(element => {
                html += "<li class='list-group-item'><div class='card mb-3' style='max-width: auto;'><div class='row g-0'>" +              
                                  "<div class='col-md-3'><img src=" + element.imgSrc + " class='img-fluid rounded-start'>" +
                                  "</div><div class='col-md-9'><div class='card-body'><h5 class='card-title single-explore-txt bg-theme-5'>" +
                                  element.cardTitle + "</h5><p class='card-text' style='margin-right: 20px;'>" + element.cardText +
                                  "</p><p class='card-text'><small class='text-body-secondary'><span>" + element.cardSmallText +
                                  "</span></small></p></div></div></div></div></li>";
              });
              $("#blog-list").html(html);
      }, function(error){
        console.error('Error fetching data from file : ', error);
      })
    }
}
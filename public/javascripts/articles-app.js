function viewIndex(){
    var url = 'http://localhost:3000/api/articles';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();

    xhr.onload = function(){
        let data  = JSON.parse(xhr.response);
        var rows = '';

        for(var i=0; i<data['articles'].length; i++){
            let x = data['articles'][i];
            rows = rows + `<tr>
                <td>
                    <a href="#edit-${x.slug}" 
                        onclick="viewArticle('${x.slug}')">
                        ${x.title}
                    </a>
                </td>
            </tr>`;
        }

        var app = document.getElementById('app');
        app.innerHTML = `<table class="table">
            <thead>
                <tr>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;

    }
}

function viewArticle(slug){
    var url = 'http://localhost:3000/api/articles/' + slug;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();

    xhr.onload = function(){
        var data = JSON.parse(xhr.response);
        var article = data.article;
        var app = document.getElementById('app');

        app.innerHTML = `
            <h2>${article.title}</h2>
            <table class="table">
                <tbody>
                    <tr><th>ID</th><td>${article._id}</td></tr>
                    <tr><th>Slug</th><td>${article.slug}</td></tr>
                    <tr><th>Title</th><td>${article.title}</td></tr>
                    <tr><th>Keywords</th><td>${article.keywords}</td></tr>
                    <tr><th>Description</th><td>${article.description}</td></tr>
                    <tr><th>Body</th><td>${article.body}</td></tr>
                </tbody>
            </table>
            
            <h3>Edit the Article Record</h3>
            <form id="editArticle" action="/api/articles" method="put">
                <input type="hidden" name="_id" value="${article._id}">
                <div>
                    <label for="title">Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="title" 
                        value="${article.title}">
                </div>

                <div>
                    <label for="keywords">Keywords</label>
                    <textarea
                        type="text" 
                        name="keywords" 
                        id="keywords">${article.keywords}</textarea>
                </div>

                <div>
                    <label for="description">Description</label>
                    <textarea 
                        type="text" 
                        name="description" 
                        id="description">${article.description}</textarea>
                </div>

                <div>
                    <label for="body">Body</label>
                    <textarea 
                        type="text" 
                        name="body" 
                        id="body">${article.body}</textarea>
                </div>

                <input type="submit" value="Submit">
            </form>
            
            <div class="actions">
                <a href="#deleteArticle-${article._id}"
                    onclick="deleteArticle('${article._id}');"
                    class="text-danger"
                >Delete</a>
            </div>
            `;

        var editArticle = document.getElementById('editArticle');
        editArticle.addEventListener('submit', function(e){
            e.preventDefault();
            var formData = new FormData(editArticle);
            var url = 'http://localhost:3000/api/articles';
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', url);
            xhr.setRequestHeader(
                'Content-Type', 
                'application/json; charset=UTF-8');

            var object={};
            formData.forEach(function(value, key){
                object[key] = value;
            });
            xhr.send(JSON.stringify(object));

            xhr.onload = function(){
                let data = JSON.parse(xhr.response);
                if(data.success===true){
                    viewIndex();
                }
            }

        });

    }
}

function createArticle(){
    var app = document.getElementById('app');
        app.innerHTML = `<h2>Create a New Article</h2>
            <form id="createArticle" action="/api/articles" method="post">
            <div>
                <label for="title">Title</label>
                <input type="text" name="title" id="title">
            </div>

            <input type="submit" value="Submit">
        </form>`;

    var createArticle = document.getElementById('createArticle');
    createArticle.addEventListener('submit', function(e){
        e.preventDefault();

        var formData = new FormData(createArticle);
        var url = 'http://localhost:3000/api/articles';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);

        xhr.setRequestHeader(
            'Content-Type',
            'application/json; charset=UTF-8'
        );

        var object = {};
        formData.forEach(function(value, key){
            object[key]=value;
        });

        xhr.send(JSON.stringify(object));
        xhr.onload = function(){
            let data = JSON.parse(xhr.response);
            if(data.success===true){
                viewIndex();
            }
        }
    });
}

function deleteArticle(id){
    if(confirm('Are you sure?')){
        
        var url = 'http://localhost:3000/api/articles/' + id;

        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', url);
        xhr.send();
    
        xhr.onload = function(){
            let data = JSON.parse(xhr.response);
            if(data.success===true){
                viewIndex();
            }
        }
    }
}

var hash = window.location.hash.substr(1);
if(hash){
    let chunks = hash.split('-');

    switch(chunks[0]){

        case 'edit':
            viewArticle(chunks[1]);
        break;

        case 'createArticle':
            createArticle();
        break;

        default:
            viewIndex();
        break;
        
    }
}else{
    viewIndex();
}
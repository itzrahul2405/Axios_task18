// AXIOS GLOBAL
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';     // using jwt.io ( real token )






// GET REQUEST
function getTodos() {
  // axios({
  //   method: 'get',
  //   url: 'https://jsonplaceholder.typicode.com/todos',
  //   params: {
  //     _limit: 5
  //   }
  // })  // this return promise so we will use then and catch
  // // .then(res => console.log(res.data))
  // .then(res => showOutput(res))
  // .catch(err => console.error(err));                                  // this is a long way



  // axios.get('https://jsonplaceholder.typicode.com/todos', {params: { _limit: 5 }})        
  axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5', { timeout: 5000 })       // since we are making a get request so we can remove get also (it is by default by axios)
  .then(res => showOutput(res))
  .catch(err => console.error(err));       

}
//  timeout is basically max time we wanna to take before just stops (here 5000ms, try with 5ms)













// POST REQUEST
function addTodo() {
  // axios({
  //   method: 'post',
  //   url: 'https://jsonplaceholder.typicode.com/todos',
  //   data: {
  //     title: 'New Todo',
  //     completed: false
  //   }
  // }) 
  // .then(res => showOutput(res))
  // .catch(err => console.error(err));


  axios.post('https://jsonplaceholder.typicode.com/todos', {title: 'New Todo', completed: false}) 
  .then(res => showOutput(res))
  .catch(err => console.error(err));

}















//  diff -> PUT is usually meant to replace the entire resource where PATCH will kind a updated incrementally 

// PUT/PATCH REQUEST
function updateTodo() {
  // axios.put('https://jsonplaceholder.typicode.com/todos/1', {title: 'Updated Todo', completed: true})       // put, patch and delete we need to include id in the url      
  // .then(res => showOutput(res))
  // .catch(err => console.error(err));
  // // notice in server userId is gone 


  axios.patch('https://jsonplaceholder.typicode.com/todos/1', {title: 'Updated Todo', completed: true})       // put, patch and delete we need to include id in the url      
  .then(res => showOutput(res))
  .catch(err => console.error(err));
  //  it still have userId because it did not completely replace
}















// DELETE REQUEST
function removeTodo() {
  axios.delete('https://jsonplaceholder.typicode.com/todos/1')       // put, patch and delete we need to include id in the url      
  .then(res => showOutput(res))
  .catch(err => console.error(err));
}















// SIMULTANEOUS DATA
function getData() {
  axios.all([
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
  ])
  // .then(res => {
  //   console.log(res[0]);
  //   console.log(res[1]);
  //   showOutput(res[1]);
  // })
  .then(axios.spread((todos, posts) => showOutput(posts)))
  .catch(err => console.error(err));
}
















// CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      'content-type': 'application/json',
      Authorization: 'sometoken'
    }
  } 

  axios.post('https://jsonplaceholder.typicode.com/todos', {title: 'New Todo', completed: false}, config)         // let say we have to logged in to create a post
  .then(res => showOutput(res))
  .catch(err => console.error(err));
}

// sometimes we have to send data to headers good example of this is when you have offenication like json web tokens , you might make a request to log in (you logged in and give back you token and then you have to send that token in the header to access protective routes )


















// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: { title: 'Hello World' },
    transformResponse: axios.defaults.transformResponse.concat(data => { 
      data.title = data.title.toUpperCase() 
      return  data;
    })       // take the default and add to that rather than override it 
  }

  axios(options).then(res => showOutput(res))
}

















// ERROR HANDLING
function errorHandling() {
  axios.get('https://jsonplaceholder.typicode.com/todoss', {
    // validateStatus: function(status){
    //   return status < 500;     // Reject only if status is greater or equal to 500
    // }
  })       // added s in the end of url to get 404 
  .then(res => showOutput(res))
  .catch(err => {
    if(err.response){
      // Server responded with a status other than 200 range
      console.log(err.response.data)
      console.log(err.response.status)
      console.log(err.response.headers)

      if(err.response.status === 404){
        alert('Error: Page Not Found');
      }
    }
    else if(err.request){
      // Request was made but no response
      console.error(err.request);
    }
    else{
      console.error(err.message);
    }
  });       
}




















// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();

  axios.get('https://jsonplaceholder.typicode.com/todos', { cancelToken: source.token })      
  .then(res => showOutput(res))
  .catch(thrown => {
    if (axios.isCancel(thrown)){
      console.log('Request canceled', thrown.message);
    }
  })

  if(true){       // for some reason if something happened and we wanna cancel that request 
    source.cancel('Request canceled!');
  }
}

















// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(config => {
  console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`);

  return config
}, error => {
  return Promise.reject(error);
});     // now we should have a little logger everytime we make a request (check console)










// AXIOS INSTANCES
const axiosInstance = axios.create({
  // Other custom settings
  baseURL: 'https://jsonplaceholder.typicode.com'
});

// axiosInstance.get('/comments').then(res => showOutput(res));








// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);

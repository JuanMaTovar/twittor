//importamos el archivo sw-utils.js
importScripts('js/sw-utils.js');

//Creamos los cache con los que estará trabajando el sw
const STATIC_CACHE    = 'static-v1';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

//Creamos el APP_SHELL que contiene lo necesario para mi app
const APP_SHELL = [
    '/',
    '/index.html',
    '/css/style.css',
    '/img/favicon.ico',
    '/img/avatars/hulk.jpg',
    '/img/avatars/ironman.jpg',
    '/img/avatars/spiderman.jpg',
    '/img/avatars/thor.jpg',
    '/img/avatars/wolverine.jpg',
    '/js/app.js',
    'js/sw-utils.js'
];
//Aquí es lo que no se va a modificar jamas
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//Evento de instalación del SW  
self.addEventListener('install', e =>{
 
    //almacenar en el cache ambos arreglos
    //abriremos el cache estatico
    const cacheStatic = caches.open(STATIC_CACHE)
    .then(cache =>{
        cache.addAll(APP_SHELL)
    });
    //abriremos el cache inmutable
    const cacheInmutable = caches.open(INMUTABLE_CACHE)
    .then(cache =>{
        cache.addAll(APP_SHELL_INMUTABLE)
    });
 
 e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});
//Evento activate
//Cada que cambie de SW borre el cache static si hubo algun cambio
self.addEventListener('activate', e =>{
//Verificar si hubo cambios en el cache actual, de lo contrario actualizar
// y borrar la cache estatico anterior
const respuesta = caches.keys()
 .then(keys => {
    keys.forEach(key =>{
        if(key !== STATIC_CACHE && key.includes('static')){
            return caches.detele(key);

        }
    });

 });
 e.waitUntil(respuesta);
});

//implementando la estrategía del cache con el cache until
//evento fetch
self.addEventListener('fetch', e => {
    //verificar en el cache si existe la request
    const respuesta = caches.match(e.request)
        .then(res =>{
            //si existe la respuesta regreso la respuesta
            if(res){
                return res;
            }else{
                return fetch(e.request)
                .then(newRes => {
                   //regresamos la función que creamos en el archivo sw-utils.js
                   return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
                });
            }
        });
    e.respondWith(respuesta);

})
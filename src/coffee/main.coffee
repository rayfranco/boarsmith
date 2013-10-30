###
This comment reside in src/coffee/main.coffee
###

console?.log 'Hello world from the coffeescript file!'

###
Preloading some files
###

loadedFiles = 0
loader      = $('#loader').find('.inner:first')
loader.css
    opacity: 1

handleFileLoad = (e) ->
  loadedFiles += 1
  console.log "#{loadedFiles} file#{if loadedFiles > 1 then 's' else ''} loaded"

handleComplete = (e) ->
  loader.css
    opacity: 0
  console.log 'Loading complete'

handleProgress = (e) ->
  loader.css
    width: e.loaded*100+'%'

queue = new createjs.LoadQueue(true)

queue.addEventListener 'fileload', handleFileLoad
queue.addEventListener 'complete', handleComplete
queue.addEventListener 'progress', handleProgress

queue.loadFile
  src: 'http://placekitten.com/g/300/300'
  type:createjs.LoadQueue.IMAGE
queue.loadFile
  src: 'http://placekitten.com/g/300/300'
  type:createjs.LoadQueue.IMAGE
queue.loadFile
  src: 'http://placekitten.com/g/300/300'
  type:createjs.LoadQueue.IMAGE
queue.loadFile
  src: 'http://placekitten.com/g/300/300'
  type:createjs.LoadQueue.IMAGE
queue.loadFile
  src: 'http://placekitten.com/g/300/300'
  type:createjs.LoadQueue.IMAGE
queue.loadFile
  src: 'http://placekitten.com/g/300/300'
  type:createjs.LoadQueue.IMAGE
queue.loadFile
  src: 'http://placekitten.com/g/300/300'
  type:createjs.LoadQueue.IMAGE
queue.loadFile
  src: 'http://placekitten.com/g/300/300'
  type:createjs.LoadQueue.IMAGE
queue.loadFile
  src: 'http://placekitten.com/g/300/300'
  type:createjs.LoadQueue.IMAGE
queue.loadFile
  src: 'http://placekitten.com/g/300/300'
  type:createjs.LoadQueue.IMAGE
queue.loadFile
  src: 'http://placekitten.com/g/300/300'
  type:createjs.LoadQueue.IMAGE



queue.load()
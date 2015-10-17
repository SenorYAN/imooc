var express = require('express')
var path =require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var port  = process.env.PORT||4000
var app = express()

mongoose.connect('mongodb://localhost/imooc')

app.set('views','./views/pages')
app.set('view engine','jade')
// app.use(express.bodyParser)
app.use(express.static(path.join(__dirname,'bower_components')))
app.listen(port)

console.log('imooc start on port ' + port)

//index
app.get('/',function(req, res){
	Movie.fetch(function(err,movies){
	    if (err) {
	    	console.log(err)
	    }

		res.render('index',{
			title:'imooc 首页',
			movies:[]
		})
	})
})


//detail
app.get('/movie/:id',function(req, res){
	var id = req.params.id

	Movie.findById(id,function(err,movie){
		res.render('detail',{
				title:'imooc'+ movie.title,
				movie:movie
		})
	})	
})


//admin
app.get('/admin/movie',function(req, res){
	res.render('admin',{
		title:'imooc 后台录入页',
		movie:{
			director:'',
			country:'',
			title:'',
			year:'',
			poster:'',
			language:'',
			flash:'',
			summary:''
		}
	})
})


//admin update movie
app.get('/admin/update/:id', function(req,res){
	var id = req.params.id

	if(id){
		Movie.findById(function(err,movie){
			res.render('admin',{
				title:'imooc 后台更新页',
				movie: movie
			})
		})
	}
})

//admin post movie
app.post('/admin/movie/new',function(res,req){
	var id =req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(id !=='undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}

			_movie = _.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}

				res.redirect('/movie/'+ movie._id)
			})
		})
	}
	else{
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})

		_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}

				res.redirect('/movie/'+ movie._id)
			})
	}
})


//list
app.get('/admin/list',function(req, res){
	Movie.fetch(function(err,movies){
	    if (err) {
	    	console.log(err)
	    }

		res.render('list',{
				title:'imooc 列表页',
				movies:movies
			})
	})
})
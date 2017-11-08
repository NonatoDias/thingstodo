/**
 * Js principal
 * @author Nonato Dias
 * @version 0.1
 * 
 * @description js principal com o modelo, todas as views e um controller
 */

 (function(webapp){
     
    var imgTypes = [
        "img/lowpriority.png",
        "img/mediumpriority.png",
        "img/highpriority.png",
    ]
    /**
     * Modelo
     * listToDo: todos os itens
     */
    var model = {
        listToDo: webapp.model("listToDo", [{
            type: 0,
            title: "Atividade",
            text: "tentando criar algo"
        }])
    }

/* ========== views =========*/
    var viewCards = {
        init: function(){
            this.el = webapp.q(".div-cards-group");
            this.btn = webapp.q("#add-itemtodo");
            this.render();
        },

        render: function(){
            var that = this;
            var listToDo = controller.data("listToDo");
            that.el.innerHTML = '';

            listToDo.forEach(function(item){
                that.cardHtml(item);
            });

            that.btn.onclick = function(){
                viewAddItem.render();
            }
        },

        cardHtml: function(item){
            this.el.insertAdjacentHTML("afterbegin", 

            '<div class="div-card">'+
                '<div class="div-card-content">'+
                    '<img class="img-card" src="'+imgTypes[item.type]+'" alt="" srcset="">'+
                    '<div class="div-card-description">'+
                        '<div class="div-card-title">'+
                            '<h1 class="h-card-title">'+item.title+'</h1>'+
                        '</div>'+
                        '<p class="p-card-text">'+item.text+'</p>'+
                    '</div>'+
                '</div>'+
            '</div>');
        }
    }

    var viewAddItem = {
        init: function(){
            this.el = webapp.q(".div-cards-group");
        },

        render: function(){
            var that = this;
            var cardAdd = webapp.q("#id-card-add")
            if(cardAdd){
                cardAdd.parentNode.removeChild(cardAdd);
            }
            that.html();

            webapp.q("#btn-add-item").onclick = function(){
                controller.addItem({
                    type: 0,
                    title: webapp.q("#input-item-title").value,
                    text: webapp.q("#textarea-item-desc").value
                });
            }
        },

        html: function(){
            this.el.insertAdjacentHTML("afterbegin", 
            '<div id="id-card-add" class="div-card">'+
                '<div class="div-card-content div-form">'+
                    '<div class="div-card-description">'+
                        '<div class="div-card-title">'+
                            '<img class="" src="img/todo.png" alt="">'+
                            '<h1 class="h-card-title">Novo Item</h1>'+
                        '</div>'+
                        '<div class="div-card-form">'+
                                '<img class="img-form" src="img/label.png" alt="">'+
                                '<input id="input-item-title" placeholder="Título" type="text" class="input-form">'+
                        '</div>'+
                        '<div class="div-card-form">'+
                                '<img class="img-form" src="img/textarea.png" alt="">'+
                                '<textarea id="textarea-item-desc" placeholder="Descrição" class="input-form" id="" cols="30" rows="4"></textarea>'+
                        '</div>'+
                        '<div style="margin-top: 10px; float: right;">'+
                            '<button id="btn-add-item" class="btn">Adicionar</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>');
        }
    }


/*======== controller ======== */

    var controller = {
        init: function(){
            this.registerSW();
            model.listToDo.bind(viewCards);
            viewAddItem.init();
            viewCards.init();
        },

        registerSW: function(){
            var ctrl = this;

            if (!navigator.serviceWorker) return;
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('sw.js').then(function(reg) {
                    
                    if (!navigator.serviceWorker.controller) {
                        return;
                    }
                
                    if (reg.waiting) {
                        ctrl._updateReady(reg.waiting);
                        return;
                    }
                
                    if (reg.installing) {
                        ctrl._trackInstalling(reg.installing);
                        return;
                    }
                
                    reg.addEventListener('updatefound', function() {
                        ctrl._trackInstalling(reg.installing);
                    });
                });

                // Ensure refresh is only called once.
                // This works around a bug in "force update on reload".
                var refreshing;
                navigator.serviceWorker.addEventListener('controllerchange', function() {
                    if (refreshing) 
                        return;
                    window.location.reload();
                    refreshing = true;
                });
            });

        },

        _trackInstalling: function(worker) {
            var ctrl = this;
            worker.addEventListener('statechange', function() {
                if (worker.state == 'installed') {
                    ctrl._updateReady(worker);
                }
            });
        },

        _updateReady: function(worker) {
            /*var toast = this._toastsView.show("New version available", {
              buttons: ['refresh', 'dismiss']
            });*/
          
            /*toast.answer.then(function(answer) {
              if (answer != 'refresh') return;
              worker.postMessage({action: 'skipWaiting'});
            });*/
        },

        data: function(key, value){
            return model[key].data(value);
        },

        addItem(item){
            var listToDo =  this.data("listToDo");
            listToDo.push(item);
            this.data("listToDo", listToDo);
        }
    }

    controller.init();

 })((function(window, document){

    function loadData(key){
        return JSON.parse(localStorage.getItem(key));
    }

    function storeData(key, data){
        localStorage.setItem(key, JSON.stringify(data));
        return data;
    }
    /**
     * Cria um modelo com databind
     * @param data 
     */
    function modelFactory(key, defaultValue){
        this._fbs_ = [];
        this.key = key;
		this._d_ = loadData(key) || storeData(key, defaultValue);
	}

	modelFactory.prototype = {
		data: function(data){
			if(data !== undefined){
				this._d_ = storeData(this.key, data);
				this._fbs_.forEach(function(f){
					try{
						f.render();
		
					}catch(err){
						console.error('A view nao possui funcao render ---> ', err);
					}            
				});
			} 			
			return this._d_;  
		},

		bind: function(view){
			this._fbs_.push(view);
		}
	}

/* ================================= */

    /**
     * Biblioteca basica 
     */
    return {
        /**
         * Busca elemento no dom
         * @return elemento
         */
        q: function(el){
            return document.querySelector(el);
        },
        /**
         * Busca elemento no dom, 
         * @return array com todos os elementos
         */
        qAll: function(el){
            var all = [];
            for(var i = 0, els = document.querySelectorAll(el); i< els.length; i++ ){
                all.push(els[i]);
            }
            return all;
        },

        /**
         * Cria um objeto com databind
         */
        model: function(key, defaultValue){
			return new modelFactory(key, defaultValue);
        }
    }

})(window, document));
/**
 * Js principal
 * @author Nonato Dias
 * @version 0.1
 * 
 * @description js principal com o modelo, todas as views e um controller
 */

 (function(webapp){
    var model = {
        cards: webapp.model("cards", []),
    }

/* ========== views =========*/
    var viewCards = {
        init: function(){
            this.el = webapp.q(".div-cards-group");
            this.render();
        },

        render: function(){
            console.log(this.el);
        }
    }


/*======== controller ======== */

    var controller = {
        init: function(){
            viewCards.init();
            console.log(model.cards.data());
        },

        data: function(key, value){
            return model[key].data(value);
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
		this._d_ = loadData(key) || defaultValue;
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
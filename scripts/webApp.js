/**
 * 
 */
let webApp = (function(){

    function loadModel(key){
        return JSON.parse(localStorage.getItem(key)) || {};
    }

    function storeModel(key, data){
        localStorage.setItem(key, JSON.stringify(data));        
    }

    /**
     * 
     * @param {Object} data 
     * @param {Object || Array} views 
     */
    function modelFactory(arg1, arg2){          
        return (function(data, views){
            var _mf_ = {};
            _mf_._d_ = data;
            _mf_._fs_ = (views instanceof Array ? views : [views]);
    
            return function(d, vs){
                //Se existir data
                if(d !==  undefined){

                    //Se existir view
                    if(vs !==  undefined){
                        if(vs instanceof Array){                        
                            _mf_._fs_ = _mf_._fs_.concat(vs);
                        }else{
                            _mf_._fs_.push(vs);
                        }
                    }else{
                        //Se tiver somente data, execulta as funcoes de renderizacao
                        _mf_._d_ = d;
                        _mf_._fs_.forEach(function(f){
                            try{
                                f.render();
                
                            }catch(err){
                                console.error('A view nao possui funcao render ---> ', err);
                            }            
                        });
                    }
                }else{
                    return _mf_._d_;//Se nao tiver atributo retorna data
                }
            }
        })(arg1, arg2);
    }

/* ================================= */

    /**
     * Biblioteca basica 
     */
    return {
        /**
         * Cria um objeto com databind
         */
        model: modelFactory,

        clearAll: function(){
            localStorage.clear();
        },

        loadModel: loadModel,
        storeModel: storeModel
    }
})()



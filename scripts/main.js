/**
 * Js principal
 * @author Nonato Dias
 * @version 0.1
 * 
 * @description js principal com o modelo, todas as views e um controller
 */


/**
 * MVC da pagina inicial
 */
 (function($){

    //Imagens
    const imgTypes = [
        "img/lowpriority.png",
        "img/mediumpriority.png",
        "img/highpriority.png",
    ]

    let model = {
        init: function(){
            let data = webApp.loadModel('model1');
            this.listToDo = webApp.model(data.listToDo || [], viewCards);
        },
        store: function(o){
            webApp.storeModel('model1', o)
        }, 
        addItem : function(item){
            var data =  this.listToDo();
            data.push(item);
            this.listToDo(data);
            model.store({
                listToDo: this.listToDo()
            });
        }
    };
    

/* =============== views =============*/
    let viewMsgAvailable = {
        init: function() {
            this.$el = $("#id-vwmsgavlbl"),
            this.$elClick = $("#vwmsgavlbl-click"),
            this.$el.hide();
        },
        render: function(callback) {
            var thatView = this;

            thatView.$elClick.click(function() {
                if(callback instanceof Function){
                    callback();
                    thatView.$el.hide();
                }
            })
            thatView.$el.show();
        }
    };


    let viewCards = {
        init: function(){
            this.$el = $(".div-cards-group");
            this.$btn = $("#add-itemtodo");
            this.$btnClear = $("#clear-alltodo");
            this.render();
        },

        render: function(){
            var thatView = this;
            var listToDo = model.listToDo();
            thatView.$el.html('');

            listToDo.forEach(function(item){
                thatView.$el.prepend(
                    `<div class="div-card">
                        <div class="div-card-content">
                            <img class="img-card" src="${imgTypes[item.type]}" alt="" srcset="">
                            <div class="div-card-description">
                                <div class="div-card-title">
                                    <h1 class="h-card-title">'${item.title}'</h1>
                                </div>
                                <p class="p-card-text">'${item.text}'</p>
                            </div>
                        </div>
                    </div>
                `)
            });

            thatView.$btn.off('click').click(function(){
                viewAddItem.render();
            })

            thatView.$btnClear.off('click').click(function(){
                controller.clearAll();
            })

        }
    }

    let viewAddItem = {
        init: function(){
            this.$el = $(".div-cards-group");
        },

        render: function(){
            var thatView = this;
            var cardAdd = document.querySelector("#id-card-add")

            if(cardAdd){
                cardAdd.parentNode.removeChild(cardAdd);
            }
            thatView.html();

            document.getElementById("input-item-title").focus();
            document.getElementById("btn-add-item").onclick = function(){
                model.addItem({
                    type: 0,
                    title: document.getElementById("input-item-title").value,
                    text: document.getElementById("textarea-item-desc").value
                });
            }
        },

        html: function(){
            this.$el.prepend(
            `<div id="id-card-add" class="div-card">
                <div class="div-card-content div-form">
                    <div class="div-card-description">
                        <div class="div-card-title">
                            <img class="" src="img/todo.png" alt="">
                            <h1 class="h-card-title">Novo Item</h1>
                        </div>
                        <div class="div-card-form">
                            <img class="img-form" src="img/label.png" alt="">
                            <input id="input-item-title" placeholder="Título" type="text" class="input-form">
                        </div>
                        <div class="div-card-form">
                            <img class="img-form" src="img/textarea.png" alt="">
                            <textarea id="textarea-item-desc" placeholder="Descrição" class="input-form" id="" cols="30" rows="4"></textarea>
                        </div>
                        <div style="margin-top: 10px; float: right;">
                            <button id="btn-add-item" class="btn">Adicionar</button>
                        </div>
                    </div>
                </div>
            </div>`);
        }
    }

/*================ controller ================ */
    let controller = {
        init: function(){
            model.init();

            viewMsgAvailable.init();
            this.registerSW();
            //model.listToDo.bind(viewCards);
            viewAddItem.init();
            viewCards.init();
        },

        clearAll: function(){
            model.listToDo([]);
            webApp.clearAll();
        },

        registerSW: function(){
            let ctrl = this;

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
                let refreshing;
                navigator.serviceWorker.addEventListener('controllerchange', function() {
                    if (refreshing) 
                        return;
                    window.location.reload();
                    refreshing = true;
                });
            });

        },

        _trackInstalling: function(worker) {
            let ctrl = this;
            worker.addEventListener('statechange', function() {
                if (worker.state == 'installed') {
                    ctrl._updateReady(worker);
                }
            });
        },

        _updateReady: function(worker) {
            viewMsgAvailable.render(function() {
                worker.postMessage({
                    actionsw: "SKIPWAITING"
                })
            })
        }
    }

    controller.init();

})(jQuery);
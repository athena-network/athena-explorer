$('#btn_search').click(function(e) {

var text = document.getElementById('txt_search').value;

function GetSearchBlockbyHeight(){

    var block, xhrGetSearchBlockbyHeight;
    if (xhrGetSearchBlockbyHeight) xhrGetSearchBlockbyHeight.abort();
    
            xhrGetSearchBlockbyHeight = $.ajax({
            url: api + '/json_rpc',
            method: "POST",
            data: JSON.stringify({
                jsonrpc:"2.0",
                id: "blockbyheight",
                method:"getblockheaderbyheight",
                params: {
                height: parseInt(text)
                }
            }),
            dataType: 'json',
            cache: 'false',
            success: function(data){
                if(data.result){
                    block = data.result.block_header;
                    window.location.href = getBlockchainUrl(block.hash);
                } else if(data.error) {
                    wrongSearchAlert();
                }
            }
        });
}

function GetSearchBlock(){
var block, xhrGetSearchBlock;
    if (xhrGetSearchBlock) xhrGetSearchBlock.abort();
        xhrGetSearchBlock = $.ajax({
            url: api + '/json_rpc',
            method: "POST",
            data: JSON.stringify({
                jsonrpc:"2.0",
                id: "GetSearchBlock",
                method:"f_block_json",
                params: {
                hash: text
                }
            }),
            dataType: 'json',
            cache: 'false',
            success: function(data){
                if(data.result){
                    block = data.result.block;
                    sessionStorage.setItem('searchBlock', JSON.stringify(block));
                    window.location.href = getBlockchainUrl(block.hash);
                } else if(data.error) {
                    $.ajax({
                        url: api + '/json_rpc',
                        method: "POST",
                        data: JSON.stringify({
                            jsonrpc:"2.0",
                            id: "test",
                            method:"f_transaction_json",
                            params: {
                                hash: text
                            }
                        }),
                        dataType: 'json',
                        cache: 'false',
                        success: function(data){
                            if(data.result){
                                sessionStorage.setItem('searchTransaction', JSON.stringify(data.result));
                                window.location.href = transactionExplorer.replace('{id}', text);
                            } else if(data.error) {
                                xhrGetTsx =  $.ajax({
                                    url: api + '/json_rpc',
                                    method: "POST",
                                    data: JSON.stringify({
                                        jsonrpc:"2.0",
                                        id: "test",
                                        method:"k_transactions_by_payment_id",
                                        params: {
                                            payment_id: text
                                        }
                                    }),
                                    dataType: 'json',
                                    cache: 'false',
                                    success: function(data){
                                        if(data.result){
                                            txsByPaymentId = data.result.transactions;
                                            sessionStorage.setItem('txsByPaymentId', JSON.stringify(txsByPaymentId));
                                            window.location.href = paymentIdExplorer.replace('{id}', text);
                                        } else if(data.error) {
                                            $('#page').after(
                                                '<div class="alert alert-warning alert-dismissable fade in" style="position: fixed; right: 50px; top: 50px;">'+
                                                    '<button type="button" class="close" ' + 
                                                            'data-dismiss="alert" aria-hidden="true">' + 
                                                        '&times;' + 
                                                    '</button>' + 
                                                    'We could not find anything.' + 
                                                '</div>');
                                        }
                                    }
                                });
                            
                            }
                        }
                    });
                }
            }	
        });
}

if ( text.length < 64 ) {
    GetSearchBlockbyHeight();
} else if ( text.length == 64 ) {
    GetSearchBlock();
} else {
    wrongSearchAlert();
}

e.preventDefault();

});

function wrongSearchAlert() {
    $('#page').after(
        '<div class="alert alert-danger alert-dismissable fade in" style="position: fixed; right: 50px; top: 50px;">'+
        '<button type="button" class="close" ' + 
        'data-dismiss="alert" aria-hidden="true">' + 
        '&times;' + 
        '</button>' + 
        '<strong>Wrong search query!</strong><br /> Please enter block height or hash, transaction hash, or payment id.' + 
        '</div>');
}

$('#txt_search').keyup(function(e){
        if(e.keyCode === 13)
            $('#btn_search').click();
});
'use strict';

/**
 * Conjunto de funções para ler o retorno em JSON do serviço de Texttract da AWS e transformar o 
 * resultado numa matriz legivel.
 * 
 * Modo de uso:
 * 
 * Passar como parametros o conjunto de Blocks retornado da analise da função getDocumentAnalysis().
 * 
 * https://docs.aws.amazon.com/textract/latest/dg/API_GetDocumentAnalysis.html
 * 
 * var tables = getTable(data.Blocks);
 * var contents = getCell(data.Blocks, tables);
 * var results = JSON.stringify(toMatrix(contents));
 * 
 * @author Leandro Martins
 */

module.exports = {

/**
 * Buscando tabela.
 * 
 * @param {*} blocks 
 */
getTable: function (blocks) {

    console.log('-----------------------------------------------');
    console.log('Buscando por tabelas nos dados extraidos...');

    let ids = [];
    let ids_result = []
    var c = 0;

    blocks.forEach(block => {

        if ((block.Relationships != null) && block.BlockType === "TABLE") {

            ids = block.Relationships[0].Ids;

            for(var id in ids) {
                ids_result.push(ids[id]);
            }
            c++;
        }
    });

    console.log('Tabelas encontradas: '+c);
    console.log('Quantidade de IDs encontrados: '+ids_result.length);
    console.log('-----------------------------------------------');
    return ids_result;
},

/**
 * Busca as celulas e seu conteudo.
 * 
 * @param {*} blocks 
 * @param {*} ids 
 */
getCell: function (blocks, ids) {

    console.log('Buscando pelo conteudo das celulas nas tabelas...');

    var cells = {};
    var ar = [];
    var text;
    var c = 0;

    blocks.forEach(block => {

        if (block.BlockType === "CELL") {

            for (var a in ids) {

                if ((block.Relationships != null) && block.Id === ids[a]) {

                    cells = block.Relationships[0].Ids;
                    text = this.getText(blocks, cells);

                    ar.push([block.RowIndex + ',' + block.ColumnIndex, text]);
                    c++;
                }
            }
        }
    });

    console.log('Celulas encontradas: '+c);
    console.log('-----------------------------------------------');
    return ar;
},

/**
 * Busca o texto de um determinada celula.
 * 
 * @param {*} blocks 
 * @param {*} cells 
 */
getText: function (blocks, cells) {

    console.log('Buscando pela as palavras que compoem as celulas...');

    var text = '';
    var c = 0;

    blocks.forEach(block => {

        if (block.BlockType === "WORD") {

            for (var a in cells) {

                if (block.Id === cells[a]) {

                    text += block.Text + ' ';
                    c++;
                }
            }
        }
    });

    console.log('Palavras encontradas: '+c);
    console.log('-----------------------------------------------');
    return text;
},

/**
 * Transforma o resultado de array numa matriz.
 */
toMatrix: function (contents) {

    console.log('Quantidade de itens que compoem a matriz: '+contents.length);

    let ar2 = [];
    let sub_ar = [];
    let linha_anterior;
    let x = 0;

    for (var i = 0; i < contents.length; i++) {

        var linha = contents[i][0].split(',')[0];
        var coluna = contents[i][0].split(',')[1];
        var valor = contents[i][1];

        if (linha != linha_anterior) {

            ar2[x] = sub_ar;
            sub_ar = [];
            x = x + 1;
        }

        if (i + 1 == contents.length) {

            ar2[x] = sub_ar;
        }
        sub_ar[coluna] = valor;
        linha_anterior = linha;
    }
    console.log('-----------------------------------------------');
    return ar2;
}

}
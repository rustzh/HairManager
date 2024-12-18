const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const filePath = path.join(__dirname, '../keras_model/FaceHairData.csv')

const filterCsvRows = (value) => {
    
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject('csv file 읽기 실패: ', err);
            }

            // csv 데이터 파싱
            const parsedData = Papa.parse(data, {
                header: true, // true: 첫 줄 헤더
                skipEmptyLines: true // 빈 줄 무시
            });

            // 데이터가 없을 경우
            if (!parsedData.data) {
                return reject('csv file에 데이터가 없습니다.');
            }

            // 데이터 찾기
            const filterdRow = parsedData.data.filter(row => row['typeCode']=== value);
            const { typeCode, typeName, typeDesc, hairName, hairDesc } = filterdRow[0];

            resolve({ typeCode, typeName, typeDesc, hairName, hairDesc } );
        });  
    });
};

module.exports = { filterCsvRows };
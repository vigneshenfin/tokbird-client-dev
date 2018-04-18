import { Injectable } from '@angular/core';
import { ToastrService } from 'toastr-ng2';
 
@Injectable()
export class FileUtil {
 
    constructor(private toastrService: ToastrService) {}
 
    isCSVFile(file) {
        return file.name.endsWith(".csv");
    }
 
    getHeaderArray(csvRecordsArr, tokenDelimeter) {        
        let headers = csvRecordsArr[0].split(tokenDelimeter);
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }
 
    validateHeaders(origHeaders, fileHeaaders) {
        if (origHeaders.length != fileHeaaders.length) {
            return false;
        }
 
        var fileHeaderMatchFlag = true;
        for (let j = 0; j < origHeaders.length; j++) {
            if (origHeaders[j] != fileHeaaders[j]) {
                fileHeaderMatchFlag = false;
                break;
            }
        }
        return fileHeaderMatchFlag;
    }
 
    getDataRecordsArrayFromCSVFile(csvRecordsArray, headerLength, 
        validateHeaderAndRecordLengthFlag, tokenDelimeter) {
        var dataArr = []
 
        for (let i = 0; i < csvRecordsArray.length; i++) {
            let data = csvRecordsArray[i].split(tokenDelimeter);
             
            if(validateHeaderAndRecordLengthFlag && data.length != headerLength){
                if(data==""){
                    // alert("Extra blank line is present at line number "+i+", please remove it.");
                    this.showFailure('Something went wrong while reading csv. Please check');
                    return null;
                }else{
                    // alert("Record at line number "+i+" contain "+data.length+" tokens, and is not matching with header length of :"+headerLength);
                    this.showFailure('Something went wrong while reading csv. Please check');
                    return null;
                }
            }
 
            let col = [];
            for (let j = 0; j < data.length; j++) {
                col.push(data[j]);
            }
            dataArr.push(col);
        }   
        return dataArr;
    }

    showSuccess(msg) {
        this.toastrService.success(msg, 'Success!');
    }
    
    showFailure(msg) {
        this.toastrService.error(msg, 'Failure!');
    }
 
}

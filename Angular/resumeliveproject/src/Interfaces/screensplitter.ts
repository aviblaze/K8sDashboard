import { Type } from "@angular/core";
import { actiondetails, stagedetails } from "./pipeline";

export interface numericalmetricinput{
    metricname: string,
    metricvalue: number | boolean
}

export interface tabulardatainput{
    tabledata: string,
    status: boolean,
    name: string
}

export interface graphdatainput{
    data: any,
    title?: string,
    graph: 'cpu' | 'memory' | 'networkio',
}

export interface componentdetails {
    name: Type<any>,
    inputs: (numericalmetricinput | tabulardatainput | graphdatainput | actiondetails|stagedetails)[] | []
}

export interface componentconfig{
    [key: number]: (componentdetails | screendetails)[];
}

export interface screendetails {
    split: 'horizontal' | 'vertical',
    splitratio: number[],
    overrideflexdirection:boolean[],
    data: componentconfig

}
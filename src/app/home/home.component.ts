import { ProductUrlApi } from './../models/productUrlApi';
import { Product } from './../models/product';
import { Component, OnInit } from '@angular/core';
import { ProductHandled } from '../models/handled';
import { ApifyAllService } from '../services/apify-all.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public showInputCrawler: boolean = false;
  public search: string = '';
  public totalProductCrawlerAll: Number = 0;
  public totalProductCrawler: Number = 0;
  public totalProductCrawlerHandled: Number = 0;
  public crawler = new Product();
  public updater = new Product();
  public listCrawler = Array<Product>();
  public listCrawlerHandled = Array<ProductHandled>();
  public productApiUrls: string = ''//Array<ProductUrlApi>();

  public urlComparation: string = '';
  public urlRunUpdater: string = '';
  public urlApiUpdater: string = '';

  public productNameDoubleSpace = Array<Product>();
  public productPriceInvalid: boolean = false;
  public productIdDuplicado: any;
  public busqueda: any;

  public idCrawler: string = '';
  public idUpdater: string = '';
  public urlComparationApify: string = '';
  public urlValidation: string = '';

  public totalCTINCode = Array<any>();
  public validationCrawler = {
    Manufacturer: "",
    ProductName: "",
    ProductUrl: "",
    ProductId: "",
    Price: "",
    ImageUri: "",
    Stock: "",
    TaskId: ""
  }
  public listManufacturer: string= '';

  public tokenApify: string = '';

  constructor(public apifyAllService: ApifyAllService) {
    this.validationCrawler = {
      Manufacturer: "",
      ProductName: "&amp|&#xE9|&#xE2|&#xEE|&#xE0|&#x2019|&#xB0",
      ProductUrl: "",
      ProductId: "#|&|;|:|,",
      Price: "^[0-9]*$|^\\d+.\\d+$",
      ImageUri: "",
      Stock: "InStock|OutOfStock",
      TaskId: ""
    }
  }

  ngOnInit(): void {
  }
  toggleEditable(event: any) {
    // console.log(event.target.checked)
    if (event.target.checked) {
      this.showInputCrawler = event.target.checked;
      // console.log(this.showInputCrawler)
    }
  }

  getJson(datas: any) {
    this.showInputCrawler = true;
    let products;
    if (typeof datas == 'string') {
      products = JSON.parse(datas);
    } else {
      products = datas;
    }
    //console.log(datas);
    this.totalProductCrawlerAll = products.length;
    console.log()
    this.listCrawler = products.filter((product: { keys: string | string[]; }) => Object.keys(product).includes('ProductId'));
    this.totalProductCrawler = this.listCrawler.length;
    this.listCrawlerHandled = products.filter((product: { keys: string | string[]; }) => Object.keys(product).includes('Handled'))
    this.totalProductCrawlerHandled = this.listCrawlerHandled.length;

    this.productApiUrls = JSON.stringify(this.listCrawler.map(x => {
      return {
        url: x.ProductUrl,
        userData: {
          Manufacturer: x.Manufacturer
        }
      }
    }))
    this.productNameDoubleSpace = this.listCrawler.filter(x => x.ProductName.includes('  '));
    this.productPriceInvalid = this.listCrawler.filter(x => typeof x.Price == 'string').length > 0 ? true : false;
    this.listManufacturer = this.listCrawler.reduce((acc: any, item: Product) => {
      if (!acc.includes(item.Manufacturer)) {
        acc = acc + item.Manufacturer + ' ';
      }
      return acc//.trim().replace(/\s+/g,"|");
    }, [])
  }

  getTotalCodes(data: Array<Product>, keyProduct: string) {
    return data.filter((product: any) => {
      if (Object.keys(product) && Object.keys(product).includes(keyProduct)) {
        return product
      }
    })
  }

  getJsonApi(id: string) {
    this.apifyAllService.getJson(id).subscribe(json => {
      console.log(json)
      this.getJson(json);
    })
  }
  getUrlComparation(x: string, y: string) {
    let body = {
      debugLog: false,
      Environment: "QASAL",
      CrawlerId: x,
      UpdaterId: y,
      SkipPrice: false,
      SkipStock: false
    }
    this.apifyAllService.getComparationApify(this.tokenApify, body).subscribe(value => {
      console.log(value.data)
      //https://console.apify.com/organization/GTLDwzJnfTMQqgBR4/actors/tasks/NwQud5cBCWmVeodrf/runs/tRXLHXhdaCwsGzj5c
      this.urlComparationApify = 'https://console.apify.com/organization/' + value.data.userId + '/actors/tasks/' + value.data.actorTaskId + '/runs/' + value.data.id;
    })
  }

  typeOfFunction(value: any) {
    return typeof value;
  }

  isNumber(data: string) {
    let value = true;
    if (!Number(data)) {
      value = false
    }
    return value;
  }

  getValidationCrawler(data: any) {
    console.log(data.Manufacturer.trim().replace(/\s+/g,"|"))
    let body = {
      "debugLog": false,
      "RobotTypes": {
        "Name": "jcYrfX1nTbpDDMLgF",
        "TaskID": data.TaskId,
        "ExcludeFields": [
          "RatingType",
          "ReviewCount",
          "RatingSourceValue",
          "ReviewLink"
        ]
      },
      "Environment": "QASAL",
      "Regex": {
        "Manufacturer": [
          {
            "Code": data.Manufacturer.trim().replace(/\s+/g," | "),
            "Match": true
          }
        ],
        "ProductName": [
          {
            "Code": data.ProductName,
            "Match": false
          }
        ],
        "ProductUrl": [
          {
            "Code": data.ProductUrl,
            "Match": true
          }
        ],
        "ProductId": [
          {
            "Code": data.ProductId,
            "Match": false
          }
        ],
        "Price": [
          {
            "Code": data.Price,
            "Match": true
          }
        ],
        "ImageUri": [
          {
            "Code": data.ImageUri,
            "Match": true
          }
        ],
        "Stock": [
          {
            "Code": data.Stock,
            "Match": true
          }
        ]
      },
      "CheckDuplicates": {
        "ProductUrl": true,
        "ProductName": true,
        "ProductId": true
      },
      "CheckMappingCodes": true,
      "CultureCode": "DK"
    }
    this.apifyAllService.getValidationApifyQA(this.tokenApify, body).subscribe(value => {
      console.log(value.data)
      this.urlValidation = 'https://console.apify.com/organization/'+ value.data.userId+'/actors/tasks/'+value.data.actorTaskId+'/runs/'+value.data.id+'#log'
      //this.urlComparationApify = 'https://console.apify.com/organization/' + value.data.userId + '/actors/tasks/' + value.data.actorTaskId + '/runs/' + value.data.id;
    })
  }

  runUpdater(){
    //let urlApiRobot = 'https://api.apify.com/v2/actor-tasks/cs_qa_salamanca~ae-firstcry-ppur-cheerio/runs?token=axzM27TTnyH9zswKmJpWxsZWr'
    let body = {
      startUrls: JSON.parse(this.productApiUrls)
    }
    this.apifyAllService.runUpdater(this.urlApiUpdater, body).subscribe(data => {
      console.log(data)
      this.urlRunUpdater = 'https://console.apify.com/organization/'+data.data.userId+'/actors/tasks/'+data.data.actorTaskId+'/runs/'+data.data.id+'#log'
      //https://console.apify.com/organization/zciCZXekdyGwWp3Mh/actors/tasks/cvXsn291PivWvxcW8/runs/8X5gdjJWJKTUB5pgV#log
    })
  }

}

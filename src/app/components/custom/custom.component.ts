import {Component, Input, OnInit} from '@angular/core';
import {DocService} from "../../service/doc.service";
import {Doc} from "../../model/doc";
import * as FileSaver from "file-saver";

// import {IAlert, NotificationComponent} from '../notification/notification.component'

@Component({
    selector: 'app-custom',
    templateUrl: './custom.component.html',
    styleUrls: ['./custom.component.scss']
})
export class CustomComponent implements OnInit {
    video: HTMLMediaElement = document.querySelector("video")
    fileName = '';
    textDivided = false;
    formData: FormData = new FormData();
    url: string | ArrayBuffer | null = '';
    format: string = '';
    spRecognitionStarted = false;
    spRecognitionProgress = 0
    rawText = []
    text = this.rawText
    dividedText = []
    keysExtracted = false
    rawTextWithSubs = this.getRawTextWithSubs();
    duration = 0.0;
    eventSource;
    keys = []

    constructor(private docService: DocService) {
    }

    divide() {
        console.log(this.textDivided)
        if (this.textDivided == true) {
            console.log(this.dividedText)
            console.log(this.dividedText.length == 0)
            if (this.dividedText.length != 0) {
                let joinedDividedText = this.dividedText.join("\n");
                console.log(joinedDividedText)
                this.text = joinedDividedText.split("\n");
            }
            /*
            else {
                    this.startDividing()
                }*/
        } else {
            this.text = this.rawText;
        }
    }

    subscribe() {
        this.eventSource = new EventSource('http://localhost:8080/events');
        const messageListener = (event) => {
            if (event.data == '[\"done\"]') {
                this.eventSource.removeEventListener('message', messageListener)
                this.spRecognitionProgress = 100;
                this.addAlert();
                this.startDividing()
            } else {
                if (event.data != "") {
                    this.rawTextWithSubs = event.data.split('\",\"');
                    this.rawText = this.getRawText();
                    this.text = this.rawText
                }
            }
        };
        this.eventSource.addEventListener('message', messageListener)
        const durationListener = (event) => {
            if (event.data == -1.0) {
                this.spRecognitionProgress = 1;
                this.eventSource.removeEventListener('duration', durationListener)
            } else {
                this.duration = event.data;
            }
        };

        this.eventSource.addEventListener('duration', durationListener)
    }

    startDividing() {
        console.log('division start has been triggered');
        this.eventSource.close();
        this.eventSource = new EventSource('http://localhost:8080/new_events');
        // this.docService.startDivision(new Doc("", "", "", ""));
        const divideListener = (event) => {
            console.log('Received event:', event.data);
            console.log('event name', event.type)

            if (event.data == '[\"done\"]') {
                console.log('dividedTextCame')
                this.eventSource.removeEventListener('division', divideListener)
                // this.spRecognitionProgress = 100;
                // this.addAlert();


            } else {
                // if (this.rawTextWithSubs.length != event.data.split('\",\"').length) {
                // if (event.data != '[""]') {

                this.textDivided = true
                this.dividedText = event.data.split('\",\"');
                this.divide()
                // }
            }
        };
        const keysListener = (event) => {
            console.log('Received event:', event.data);
            console.log('event name', event.type)

            if (event.data == '[\"done\"]') {
                console.log('keysCame')
                this.keysExtracted = true
                this.eventSource.removeEventListener('keys', keysListener)
                // this.spRecognitionProgress = 100;
                // this.addAlert();
                this.keysAlert()

            } else {
                // if (this.rawTextWithSubs.length != event.data.split('\",\"').length) {
                // if (event.data != '[""]') {
                this.keys = event.data.replace(']', '').replace('[', '').split(',');
                // this.divide()
                // }
            }
        };
        this.eventSource.addEventListener('division', divideListener);
        this.eventSource.addEventListener('keys', keysListener);
    }

    ngOnInit() {
        console.log(this.dividedText)
        console.log(this.dividedText.length == 0)
        // this.rawTextWithSubs = "1, 1".split(',');
        /*const eventSource = new EventSource('http://localhost:8080/events');
        const messageListener = (event) => {
            console.log('Received event:', event.data);
            console.log('event name', event.type)

            if (event.data == '[\"done\"]') {
                eventSource.close()
                this.spRecognitionProgress = 100;
                this.addAlert();

            } else {
                // if (this.rawTextWithSubs.length != event.data.split('\",\"').length) {
                if (event.data != "") {
                    this.rawTextWithSubs = event.data.split('\",\"');
                    this.rawText = this.getRawText();
                }
            } };
        const durationListener = (event) => {
            console.log('Received event:', event.data);

            console.log('event name', event.type)
            if (event.data == -1.0) {
                eventSource.removeEventListener('duration', durationListener)}
            else {
                this.duration = event.data;
            }
            };

        eventSource.addEventListener('message', messageListener)
        eventSource.addEventListener('duration', durationListener)*/
        /*        eventSource.addEventListener('message', event => {
                        console.log('Received event:', event.data);

                        console.log('event name', event.type)

                        if (event.data == '[\"done\"]') {
                            eventSource.close()
                            this.spRecognitionProgress = 100;
                            this.addAlert();

                        } else {
                            // if (this.rawTextWithSubs.length != event.data.split('\",\"').length) {
                            if (event.data != "") {
                                this.rawTextWithSubs = event.data.split('\",\"');
                                this.rawText = this.getRawText();
                            }
                        }
                        // this.rawTextWithSubs= [...this.rawTextWithSubs];
                    }
                    /!*  if(event.data == 'done') {  console.log('Received done:', event.data);
                      }*!/);*/
        /*        eventSource.addEventListener('duration', event => {
                    console.log('Received event:', event.data);

                    console.log('event name', event.type)
                    if (event.data == -1.0) {
                    }
                    else {
                        this.duration = event.data;
                    }
                });*/
        // this.doc =  new Doc(1, 'qqwe', '123', '123');}

    }


    // notification : NotificationComponent;


    onSelectFile(event: any) {
        const file = event.target.files && event.target.files[0];
        this.formData = new FormData()
        this.formData.append('videoFile', event.target.files[0], event.target.files[0].name)
        if (file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            this.format = 'none';
            /*  if (file.type.indexOf('image') > -1) {
                  this.format = 'image';
              } else */
            if (file.type.indexOf('video') > -1) {
                this.format = 'video';
            }
            reader.onload = (event) => {
                this.url = (<FileReader>event.target).result;
            }
        }
    }

    getRawText() {

        console.log('duration: ' + this.duration)
        let ind1;
        let ind
        let newText = []
        const textWithSubs = this.rawTextWithSubs;
        for (let item of textWithSubs) {
            ind = item.indexOf("]");
            if (ind > 0) {
                ind1 = item.indexOf(">")
                if (ind1 != -1 && this.duration > 0.0 &&
                    textWithSubs.indexOf(item) == textWithSubs.length - 1) {
                    this.spRecognitionProgress = Math.ceil((+item.substring(ind1 + 2, ind - 1))
                        / this.duration * 100);
                }
                newText.push(item.substring(ind + 2).replace(']', '').replace('[', '').replace('"', ''))
            } else {
                newText.push(item.replace(']', '').replace('[', '').replace('"', ''))
            }
        }
        let t = newText.join(" ");
        return [t]
        // return newText.join(" ")

        // const markina = 'ф\n\nрр\n\nшшшш\n\nззз';
        // const markina = 'Так, повторюсь, что мы обсуждаем тестирование на проникновение. \n\n Основные способы проникновения и этапы пентестов указаны на слайде. В основе испытаний на проникновение могут лежать несколько различных методик. Основными отличиями являются наличие какой-либо информации об исследуемой системе. \n\n При проверке закрытых систем атакующий не имеет первоначальных сведений. И первоначальная задача такого вида проверки – именно сбор необходимой информации о расположении целевой системы, ее инфраструктуре, то есть в принципе все, что можно будет достать. Помимо закрытых систем существуют еще открытые системы. Там, возможно, доступна полная информация целевой системы или полузакрытые имеются лишь частичной информацией. Соответственно, мы здесь видим пассивный сбор информации, сканирование портов, определение типов и видов сетевого оборудования, ОС, смежной периферии, специализированных устройств. То есть это все направлено для сбора информации для проведения последующих атак. К целевым системам также относятся компьютерные системы с доступом и сети интернет. Испытание на проникновение должно проводиться до запуска целевой системы в массовое использование. Это дает вам определенный уровень гарантии, что любой атакующий не сможет нанести вред прямой или косвенной работе исследуемой системы. Для сбора информации о том, что за операционная система, происходит сбор и об существующих уязвимостях. \n\n Это строится на основе по которой определяется, которая используется, и также возможны уязвимости в архитектуре. Пять типов уязвимостей мы с вами разобрали. Кто помнит. \n\n Кто-нибудь помнит. Можно голосом сказать. Там было пять типов уязвимостей мы с вами разобрали. \n\n Все полезли в презентации. У нас были уязвимости кода, уязвимости архитектуры, организационные уязвимости, уязвимости еще смешанного характера и еще один тип уязвимостей. Человеческий фактор. Человеческий фактор или что-то такое. Нет, это организационные уязвимости. \n\n Идем дальше. Соответственно, вы получаете информацию, в частности, во время исследования об уязвимости и возможных последствиях их эксплуатации. Также производится оценка эффективности действующих мер защиты и планирование дальнейших действий по устранению обнаруженных проблем и повышению уровня общей защищенности. Тестирование на проникновение может также проводиться для обеспечения в соответствии с стандартом безопасности, например. Что касается внешнего тестирования на проникновение, оно проводится с внешней стороны контура без предварительных данных об IT-инфраструктуре организации. То есть в целом вы пытаетесь также просканировать порты, все, что возможно, чтобы собрать информацию и дальше ее как-то использовать. Внутреннее тестирование на проникновение. Тут уже имитация действий внутреннего злоумышленника, то есть, например, возможно, посетителя. \n\n В свое время, еще было лет 5 назад, еще на дискетах приносили, и там, в принципе, был только дисковод. Соответственно, происходит имитация подобных физических контактов с доступом в офис. Возможно, у подрядчика ограниченный доступ к определенным системам. В том числе фишинг, вредоносные ссылки в электронных письмах, подозрительное уважение, то есть, все возможные способы. Отдельно производится анализ защищенности беспроводных сетей. Какие уязвимости беспроводных сетей, в частности, например, сетей Wi-Fi вы знаете. Возможно, утечка данных. Кто отслеживает передачу данных, он может получить те данные, которые мы не хотели бы, чтобы кто-то еще знал. ';
        // return markina.split('\n\n')
    }

    getRawTextWithSubs() {
        var text = ""

        return text.split('\n')
    }

    @Input()
    public alerts: Array<IAlert> = [];
    private backup: Array<IAlert>;

    public closeAlert(alert: IAlert) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    ////
    public addAlert() {
        this.alerts = [{
            id: 1,
            type: 'success',
            strong: 'Готово!',
            message: 'Текст был успешно извлечен.',
            icon: 'ui-2_like'
        }/*, {
            id: 2,
            strong: 'INFO',
            type: 'info',
            message: 'Press toggle button to divide text on paragraphs',
            icon: 'travel_info'
        }*/];
        this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));

        // this.alerts = [...this.alerts]
    }

    public keysAlert() {
        this.alerts = [{
            id: 1,
            type: 'success',
            strong: 'Готово!!',
            message: 'Ключевые слова извлечены.',
            icon: 'ui-2_like'
        }];
        this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));

        // this.alerts = [...this.alerts]
    }

    processVideo() {
        console.log("at service")
        //this.docService.save(new Doc(1, this.url, "test", "me")).subscribe(result => console.log("response", result))
        this.docService.sendVideo(this.formData)
        this.subscribe()
    }

    setTime(time: string) {
        this.video = document.querySelector("video")
        console.log(this.video)
        console.log(this.video.currentTime)
        console.log(time)
        this.video.currentTime = +time;
    }

    saveDoc() {
        // this.docService.save(new Doc(1, "", "Заголовок", "Маша")).subscribe(result => console.log("response", result))

        let file = new Blob(["Ключевые слова: " + this.keys.join(", ").replace(']', '').replace('"', '').replace("\"", '') + "\n\n" + this.dividedText.join("\n").replace(']', '').replace('\"', '').replace('[', '')], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(file, "record.txt");

    }

}

export interface IAlert {
    id: number;
    type: string;
    strong?: string;
    message: string;
    icon?: string;
}

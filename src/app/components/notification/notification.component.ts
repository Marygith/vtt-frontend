import { Input, Component } from '@angular/core';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})

export class NotificationComponent {
    @Input()
    public alerts: Array<IAlert> = [];
    private backup: Array<IAlert>;

    constructor() {
        this.alerts.push({
            id: 1,
            type: 'success',
            strong: 'Well done!',
            message: 'You successfully read this important alert message.',
            icon: 'ui-2_like'
        }, {
            id: 2,
            strong: 'Heads up!',
            type: 'info',
            message: 'This is an info alert',
            icon: 'travel_info'
        }, {
            id: 3,
            type: 'warning',
            strong: 'Warning!',
            message: 'This is a warning alert',
            icon: 'ui-1_bell-53'
        }, {
            id: 4,
            type: 'danger',
            strong: 'Oh snap!',
            message: 'This is a danger alert',
            icon: 'objects_support-17'
        });
        this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
    }

    public closeAlert(alert: IAlert) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
    ////
    public addAlert() {
        this.alerts = [];
        this.alerts.push({
            id: 1,
            type: 'success',
            strong: 'Done!',
            message: 'Video  has been successfully converted to text.',
            icon: 'ui-2_like'
        }, {
            id: 2,
            strong: 'INFO',
            type: 'info',
            message: 'Press toggle button to divide tex on paragraphs',
            icon: 'travel_info'
        });
        this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));

        // this.alerts = [...this.alerts]
    }
    ////
}

export interface IAlert {
    id: number;
    type: string;
    strong?: string;
    message: string;
    icon?: string;
}

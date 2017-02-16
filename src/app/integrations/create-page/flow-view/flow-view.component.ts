import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { log, getCategory } from '../../../logging';
import { CurrentFlow, FlowEvent } from '../current-flow.service';
import { Integration } from '../../../store/integration/integration.model';

const category = getCategory('IntegrationsCreatePage');

@Component({
  selector: 'ipaas-integrations-flow-view',
  templateUrl: './flow-view.component.html',
  styleUrls: ['./flow-view.component.scss'],
})
export class FlowViewComponent implements OnInit, OnDestroy {

  i: Integration = <Integration>{};
  flowSubscription: Subscription;
  childRouteSubscription: Subscription;
  urls: UrlSegment[];
  currentPosition: number;
  currentState: string;
  integrationName: string = '';
  finishIsCollapsed: boolean = false;
  startIsCollapsed: boolean = false;

  constructor(
    private currentFlow: CurrentFlow,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.i.name = 'Integration Name';
  }

  getClass(state, position) {
    if (state === this.currentState && position === this.currentPosition) {
      return 'bold';
    } else {
      return '';
    }
  }

  integrationNameChanged($event) {
    this.currentFlow.events.emit({
      kind: 'integration-set-name',
      name: $event,
    });
  }

  handleFlowEvent(event: FlowEvent) {
    switch (event.kind) {
      case 'integration-updated':
        this.i = event['integration'];
        this.integrationName = this.i.name;
        break;
      case 'integration-connection-select':
        this.currentState = 'connection-select';
        this.currentPosition = event['position'];
        break;
      case 'integration-connection-configure':
        this.currentState = 'connection-configure';
        this.currentPosition = event['position'];
        break;
    }
  }

  ngOnInit() {
    this.flowSubscription = this.currentFlow.events.subscribe((event: FlowEvent) => {
      this.handleFlowEvent(event);
    });

    log.debugc(() => 'Integration: ' + JSON.stringify(this.i));
  }

  ngOnDestroy() {
    this.flowSubscription.unsubscribe();
  }

  collapsed(event: any): void {
    log.debugc(() => 'Event' + event);
  }

  expanded(event: any): void {
    log.debugc(() => 'Event' + event);
  }

}
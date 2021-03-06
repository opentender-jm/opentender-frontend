import {Component, Input, EventEmitter, Output} from '@angular/core';
import {I18NService} from '../../../i18n/services/i18n.service';
import {ITableColumn} from '../../../../app.interfaces';

@Component({
	moduleId: __filename,
	selector: 'select-columns-button',
	templateUrl: 'select-columns-button.component.html',
	styleUrls: ['select-columns-button.component.scss']
})
export class SelectColumnsButtonComponent {
	@Input() columns_all: Array<ITableColumn>;
	@Input() columns_active: Array<ITableColumn>;
	@Input() title: string;
	@Input() title_value: string;
	@Input() loading: any;
	@Output() selectChange = new EventEmitter();
	@Output() restore = new EventEmitter();
	showDialog = false;

	constructor(private i18n: I18NService) {
		this.title = i18n.get(this.title || 'Select Column');
	}

	onSelectColumns(event) {
		this.selectChange.emit(event);
	}
	restoreColumns() {
		this.restore.emit();
	}
}

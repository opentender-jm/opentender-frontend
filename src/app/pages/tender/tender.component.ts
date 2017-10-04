import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {PlatformService} from '../../services/platform.service';
import {ConfigService, Country} from '../../services/config.service';
import {Consts} from '../../model/consts';
import {NotifyService} from '../../services/notify.service';
import {Utils} from '../../model/utils';
import {I18NService} from '../../services/i18n.service';

@Component({
	moduleId: __filename,
	selector: 'tender',
	templateUrl: 'tender.template.html'
})
export class TenderPage implements OnInit, OnDestroy {
	public tender: Definitions.Tender;
	private loading: number = 0;
	private sub: any;
	public portal: Country;
	public state: { [name: string]: { open: boolean, label?: string } } = {
		lots: {open: true},
		buyer: {open: true},
		indi: {open: true},
		info: {open: true},
		desc: {open: true},
		reqs: {open: false},
		additional: {open: false},
		documents: {open: false},
		publications: {open: false},
	};
	public indicators = {
		cr: [],
		tr: [],
		ac: []
	};

	constructor(private route: ActivatedRoute, private api: ApiService, private config: ConfigService, private platform: PlatformService, private notify: NotifyService, private i18n: I18NService) {
		if (!this.platform.isBrowser) {
			this.state.additional.open = true;
			this.state.documents.open = true;
			this.state.publications.open = true;
			this.state.reqs.open = true;
		}
		this.state.lots.label = this.i18n.get('Lots');
		this.state.buyer.label = this.i18n.get('Buyer');
		this.state.indi.label = this.i18n.get('Indicators');
		this.state.info.label = this.i18n.get('Tender Information');
		this.state.desc.label = this.i18n.get('Description');
		this.state.reqs.label = this.i18n.get('Requirements');
		this.state.additional.label = this.i18n.get('Additional Information');
		this.state.documents.label = this.i18n.get('Documents');
		this.state.publications.label = this.i18n.get('Publications');
		this.portal = config.country;
	}

	getLotCollapse(lot, index) {
		let result = (this.state['lot' + index]);
		if (!result) {
			result = {
				open: !this.platform.isBrowser,
				label: this.i18n.get('Lot') + ' ' + (index + 1)
			};
			this.state['lot' + index] = result;
		}
		return result;
	}

	ngOnInit(): void {
		this.sub = this.route.params.subscribe(params => {
			let id = params['id'];
			this.loading++;
			this.api.getTender(id).subscribe(
				(result) => this.display(result.data),
				(error) => {
					this.notify.error(error);
				},
				() => {
					this.loading--;
				});
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	display(tender: Definitions.Tender): void {
		this.tender = tender;

		this.indicators.ac = [];
		this.indicators.cr = [];
		this.indicators.tr = [];
		if (tender.indicators) {
			tender.indicators.forEach(indicator => {
				if (indicator.type.indexOf(Consts.indicators.ac.prefix) === 0) {
					this.indicators.ac.push(indicator);
				} else if (indicator.type.indexOf(Consts.indicators.cr.prefix) === 0) {
					this.indicators.cr.push(indicator);
				} else if (indicator.type.indexOf(Consts.indicators.tr.prefix) === 0) {
					this.indicators.tr.push(indicator);
				}
			});
		}
	}

	download(format): void {
		Utils.downloadJSON(this.tender, 'tender-' + this.tender.id);
	}

}

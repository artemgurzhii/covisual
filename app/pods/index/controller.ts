import Controller from '@ember/controller';
import { ItemApp, ChartData, Country, Stat } from 'covisual/types';
import { Index_Route_Model } from './route';
import { tracked } from '@glimmer/tracking';
import { action, computed } from '@ember/object';
import palette from 'covisual/utils/palette';

interface Option {
  label: string;
  isLogarithmic: boolean;
  stat: Stat;
  isBold: boolean;
}

export default class Index extends Controller {
  model!: Index_Route_Model;

  @tracked
  countryNamesAvailable: Country[] = [
    'Austria',
    'Azerbaijan',
    'Belarus',
    'Belgium',
    'Canada',
    'China',
    'Czechia',
    'Georgia',
    'Denmark',
    'Finland',
    'France',
    'Germany',
    'India',
    'Ireland',
    'Italy',
    'Japan',
    'Kazakhstan',
    'Poland',
    'Romania',
    'Russia',
    'Spain',
    'Turkey',
    'Ukraine',
    'US',
    'United Kingdom',
  ];

  @tracked
  countryNamesSelected: Country[] = [
    // prettier-ignore
    'Russia',
    'Kazakhstan',
    'Ukraine',
  ];

  options: Option[] = [
    {
      label: 'Новые еженедельные случаи (линейные)',
      isLogarithmic: false,
      stat: 'confirmedNewWeekly',
      isBold: false,
    },
    {
      label: 'Новые еженедельные случаи (логарифмические)',
      isLogarithmic: true,
      stat: 'confirmedNewWeekly',
      isBold: false,
    },
    {
      label: 'Недельное / общее число случаев (логарифмическое)',
      isLogarithmic: true,
      stat: 'confirmedRatioWeekly',
      isBold: true,
    },
    {
      label: 'Новые еженедельные смерти (линейные)',
      isLogarithmic: false,
      stat: 'deathsNewWeekly',
      isBold: false,
    },
    {
      label: 'Новые еженедельные смерти (логарифмические)',
      isLogarithmic: true,
      stat: 'deathsNewWeekly',
      isBold: false,
    },
    {
      label: 'Недельное / общее число умерших (логарифмическое)',
      isLogarithmic: true,
      stat: 'deathsRatioWeekly',
      isBold: true,
    },
  ];

  @tracked option: Option = this.options.findBy('stat', 'confirmedRatioWeekly')!;

  get itemsAppArrays(): ItemApp[][] {
    return this.model.itemsAppArrays;
  }

  get itemsAppArraysFiltered(): ItemApp[][] {
    return this.itemsAppArrays.filter((itemsApp) =>
      this.countryNamesAvailable.includes(itemsApp[0].countryName)
    );
  }

  @computed('countryNamesAvailable.[]')
  get palette(): string[] {
    return palette(this.countryNamesAvailable.length);
  }

  get chartData(): ChartData {
    return {
      labels: this.itemsAppArraysFiltered[0].mapBy('date'),
      datasets: this.itemsAppArraysFiltered.map((itemsApp: ItemApp[], index: number) => {
        const label = itemsApp[0].countryName;

        return {
          label,
          data: itemsApp.map((item) => item[this.option.stat]),
          fill: false,
          hidden: !this.countryNamesSelected.includes(label),
          borderColor: this.palette[index],
        };
      }),
    };
  }

  get chartOptions(): any {
    return {
      legend: {
        position: 'right',
      },

      maintainAspectRatio: false,

      // plugins: {
      //   datalabels: {
      //     align: 'end',
      //     anchor: 'end',
      //     color: function (context: any): string {
      //       return context.dataset.borderColor;
      //     },
      //     font: function (context: any): any {
      //       const w = context.chart.width;
      //       return {
      //         size: w < 512 ? 12 : 14,
      //       };
      //     },
      //     formatter: function (_value: number, context: any): string {
      //       return context.dataset.label;
      //     },
      //     rotation: -45,
      //   },
      // },

      scales: {
        yAxes: [
          {
            display: true,
            type: this.option.isLogarithmic ? 'logarithmic' : 'linear',
          },
        ],
      },
    };
  }

  @action
  selectOption(option: Option): void {
    this.option = option;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    index: Index;
  }
}

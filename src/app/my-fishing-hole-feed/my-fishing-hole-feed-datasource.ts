import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface MyFishingHoleFeedItem {
  nickName: string;
  river: string;
  road: string;
  city: string;
  state: string;
  geoCode: string;
  riverLevel: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: MyFishingHoleFeedItem[] = [];

/**
 * Data source for the MyFishingHoleFeed view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class MyFishingHoleFeedDataSource extends DataSource<MyFishingHoleFeedItem> {
  data: MyFishingHoleFeedItem[] = EXAMPLE_DATA;

  constructor(private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<MyFishingHoleFeedItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginators length
    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: MyFishingHoleFeedItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: MyFishingHoleFeedItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'river': return compare(a.nickName, b.nickName, isAsc);
        case 'nickName': return compare(+a.river, +b.river, isAsc);
        case 'accessRoad': return compare(+a.road, +b.road, isAsc);
        case 'city': return compare(+a.city, +b.city, isAsc);
        case 'state': return compare(+a.state, +b.state, isAsc);
        case 'geoCode': return compare(+a.geoCode, +b.geoCode, isAsc);
        case 'riverLevel': return compare(+a.riverLevel, +b.riverLevel, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

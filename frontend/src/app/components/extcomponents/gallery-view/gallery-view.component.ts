import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { GalleryComponent } from '../gallery/gallery.component';
import { SearchComponent } from '../search/search.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

// enum ViewMode {
//   GALLERY = 'gallery',
//   SEARCH = 'search'
// }

import { register } from 'swiper/element/bundle';

// Step 2: Add the following line...
register();


@Component({
  selector: 'app-gallery-view',
  imports: [GalleryComponent,SearchComponent,TabsModule],
  templateUrl: './gallery-view.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './gallery-view.component.css'
})
export class GalleryViewComponent{


  viewMode:string = "GALLERY";

  


  toggleMode(mode:string) {
    this.viewMode=mode
    
  }
}

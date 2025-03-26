import { Component } from '@angular/core';
import { GalleryComponent } from '../gallery/gallery.component';
import { SearchComponent } from '../search/search.component';
import { TabsModule } from 'ngx-bootstrap/tabs';


import { register } from 'swiper/element/bundle';
//register swiper component
register();


@Component({
  selector: 'app-gallery-view',
  imports: [GalleryComponent,SearchComponent,TabsModule],
  templateUrl: './gallery-view.component.html',

  styleUrl: './gallery-view.component.css'
})
export class GalleryViewComponent{



}

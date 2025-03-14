import { Component, OnInit } from '@angular/core';
import { GalleryComponent } from '../gallery/gallery.component';
import { SearchComponent } from '../search/search.component';


// enum ViewMode {
//   GALLERY = 'gallery',
//   SEARCH = 'search'
// }

@Component({
  selector: 'app-gallery-view',
  imports: [GalleryComponent,SearchComponent],
  templateUrl: './gallery-view.component.html',
  styleUrl: './gallery-view.component.css'
})
export class GalleryViewComponent{


  viewMode:string = "GALLERY";

  


  toggleMode(mode:string) {
    this.viewMode=mode
    
  }
}

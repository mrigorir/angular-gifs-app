import { Component } from '@angular/core';
import { GifsService } from '../../../gifs/services/gifs.service';

@Component({
  selector: 'shared-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  arrTags: string[] = [];
  constructor (private gifsService: GifsService) {}

  get tags() {
    return this.gifsService.tagHistory;
  }

  searchGif(tag:string):void {
    this.gifsService.searchTag(tag);
  }


}

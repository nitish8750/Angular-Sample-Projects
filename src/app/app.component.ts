import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  error = null;
  errorSub: Subscription
  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {

    this.errorSub = this.postService.error.subscribe(errorMsg => {
      this.error = errorMsg;
    })

    this.isFetching = true;
    this.postService.fetchPosts().subscribe(postData => {
      this.isFetching = false;
      this.loadedPosts = postData;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
      console.log(error);
    });
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.postService.createAndStorePosts(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(postData => {
      this.isFetching = false;
      this.loadedPosts = postData;
    });
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    })
  }

  ngOnDestroy(){
    this.errorSub.unsubscribe();
  }
}

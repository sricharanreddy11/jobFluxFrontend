import { Component, HostListener, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticatorService } from '../../authenticator/authenticator.service';
import { CommandSearchService } from './command-search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-command-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './command-search.component.html',
  styleUrl: './command-search.component.css'
})
export class CommandSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput') searchInput: ElementRef | undefined;
  
  isOpen = false;
  searchQuery: string = '';
  isAuthenticated = false;
  isLoading = false;
  private subscription: Subscription | undefined;

  suggestions: string[] = [
    'Create a new task',
    'Add a note summarizing my tasks',
    'Navigate to my tasks',
    'Navigate to my projects',
    'View alerts',
    'Interact with the AI assistant',
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticatorService,
    private commandSearchService: CommandSearchService
  ) {}

  ngOnInit() {
    this.checkAuthStatus();
    
    // Subscribe to the service to know when to open/close the modal
    this.subscription = this.commandSearchService.isOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
      if (isOpen) {
        setTimeout(() => this.focusSearchInput(), 50);
      }
    });
  }

  ngAfterViewInit() {
    // Focus input after view is initialized if modal is open
    if (this.isOpen) {
      this.focusSearchInput();
    }
  }

  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  checkAuthStatus(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
  }

  // Listen for keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      this.checkAuthStatus();
      event.preventDefault();
      this.commandSearchService.toggleCommandSearch();
    }
    if (event.key === 'Escape') {
      this.closeSearch();
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.executeCommand();
  }

  toggleSearch() {
    this.commandSearchService.toggleCommandSearch();
  }

  closeSearch() {
    this.commandSearchService.closeCommandSearch();
    this.searchQuery = '';
  }

  executeCommand() {
    if (!this.searchQuery.trim()) return;

    const paramsObj = { command: this.searchQuery };

    // Send query to backend for processing
    this.isLoading = true;
    // this.devAPIService.executeCommand(paramsObj).subscribe(
    //   (response) => {
    //     this.isLoading = false;
    //     if (response.route) {
    //       if (response.route === 'unknown') {
    //         this.closeSearch();
    //         this.router.navigate(['dev/dashboard']);
    //         return;
    //       }
    //       else{
    //         this.closeSearch();
    //         this.route.url.subscribe(url => console.log(url))
    //         var creationIntent = response.creation_intent;
    //         var createdObjId = response.created_obj_id;
    //         console.log(response);
    //         if (creationIntent === "true") {
    //           if(response.route === 'dev/tasks'){
    //             this.tasksService.getTaskList().subscribe(
    //               (resData: any) => {
    //               console.log(resData);
    //               this.tasksService.tasks = resData;
    //               const selectedTask = resData.find((task: any) => task.id == createdObjId);
    //               if (selectedTask) {
    //                 this.tasksService.selectedTask = selectedTask;
    //                 this.tasksService.openTaskDetailForm();
    //               }
    //               }
    //             );
    //             this.router.navigate([response.route]);
    //           }
    //           else if (response.route === 'dev/note-maker'){
    //             this.devAPIService.getAllNotes().subscribe(
    //               (resData: any) => {
    //               this.noteService.notes = resData;
    //               const selectedNote = resData.find((note: Note) => note.id == createdObjId);
    //               if (selectedNote) {
    //                 this.noteService.selectedNote = selectedNote;
    //               }
    //               }
    //             );
    //             this.router.navigate([response.route]);
    //           }
    //           else{
    //             this.router.navigate([`${response.route}/${createdObjId}`]);
    //           }
    //         }
    //         else {
    //           this.router.navigate([response.route]);
    //         }
    //       }
    //     }
    //   },
    //   (error) => {
    //     this.isLoading = false;
    //     console.error('Error fetching route:', error);
    //   }
    // );
  }

  // Improved method to focus the search input using ViewChild
  private focusSearchInput() {
    try {
      // First priority: use ViewChild if available
      if (this.searchInput && this.searchInput.nativeElement) {
        console.log('Focusing input using ViewChild');
        this.searchInput.nativeElement.focus();
        return;
      }
      
      // Second approach: direct DOM query
      const input = document.querySelector('input[type="text"]');
      if (input) {
        console.log('Focusing input using querySelector');
        (input as HTMLElement).focus();
        return;
      }
      
      // Last resort: try again after a longer delay
      console.log('Could not find input element, retrying with longer delay');
      setTimeout(() => {
        const retryInput = document.querySelector('input[type="text"]');
        if (retryInput) {
          (retryInput as HTMLElement).focus();
        }
      }, 200);
    } catch (error) {
      console.error('Error focusing input:', error);
    }
  }
}
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Note } from './note.model';
import { NoteService } from './note.service';
import { FLuxAPIService } from '../flux.service';
import { map, debounceTime, distinctUntilChanged, startWith, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-note-maker',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass, DatePipe, ReactiveFormsModule],
  templateUrl: './note-maker.component.html',
  styleUrl: './note-maker.component.css',
})
export class NoteMakerComponent implements OnInit {

  showDeleteConfirmation = false;
  isShareMenuOpen = false;
  isLoading = false;
  searchParam = new FormControl('');

  constructor(private fluxAPIService: FLuxAPIService, public noteService: NoteService) {
    this.searchParam.valueChanges.pipe(
      map(value => value?.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
      tap(() => this.isLoading = true),
      switchMap(searchTerm => {
        if (!searchTerm || searchTerm.length === 0) {
          return this.fluxAPIService.getAllNotes();
        } else if (searchTerm.length >= 3) {
          return this.fluxAPIService.getAllNotes({ search: searchTerm });
        } else {
          this.isLoading = false;
          return of([]);
        }
      })
    ).subscribe(
      (apiData: Note[]) => {
        this.noteService.notes = apiData;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching notes:', error);
        this.isLoading = false;
      }
    );
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.fluxAPIService.getAllNotes().subscribe(
      (apiData: Note[]) => {
        this.noteService.notes = apiData;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching notes:', error);
        this.isLoading = false;
      }
    );

    // Auto-save every 5 minutes
    setInterval(() => {
      if (this.noteService.selectedNote) {
        this.saveNote();
      }
    }, 300000); // 300,000 ms = 5 minutes
  }

  addNewNote() {
    const newNote = { title: 'Untitled', content: '', tags: [] };
    this.fluxAPIService.createNote(newNote).subscribe(
      (apiData: Note) => {
        this.noteService.notes.push(apiData);
        this.selectNote(apiData);
      },
      (error) => {
        console.error('Error creating note:', error);
      }
    );
  }

  searchNotes(search: string | null) {
    const params = {
      search: search
    }
    this.isLoading = true;
    this.fluxAPIService.getAllNotes(params).subscribe(
      (apiData: Note[]) => {
        this.noteService.notes = apiData;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching notes:', error);
        this.isLoading = false;
      }
    )
  }

  selectNote(note: Note) {
    this.noteService.selectedNote = note;
  }

  saveNote() {
    if (this.noteService.selectedNote) {
      this.fluxAPIService.updateNote(this.noteService.selectedNote, String(this.noteService.selectedNote.id)).subscribe(
        (response) => {
          console.log('Note saved:', response);
        },
        (error) => {
          console.error('Error saving note:', error);
        }
      );
    }
  }

  // Delete functionality
  deleteNote(): void {
    if (this.noteService.selectedNote) {
      this.showDeleteConfirmation = true;
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

  confirmDelete() {
    if (this.noteService.selectedNote) {
      this.fluxAPIService.deleteNote(String(this.noteService.selectedNote.id)).subscribe(
        (response) => {
          console.log('Note deleted:', response);
          this.showDeleteConfirmation = false;
          window.location.reload()
        },
        (error) => {
          console.error('Error deleting note:', error);
        }
      );
    }
  }

  // Share functionality
  toggleShareMenu(): void {
    this.isShareMenuOpen = !this.isShareMenuOpen;
  }

  shareNote(format: string): void {
    if (!this.noteService.selectedNote) return;
    
    const title = this.noteService.selectedNote.title || 'Untitled';
    const content = this.noteService.selectedNote.content;
    
    switch (format) {
      case 'email':
        const subject = encodeURIComponent(`Job Flux Note: ${title}`);
        const body = encodeURIComponent(content);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        break;
        
      case 'markdown':
        this.downloadFile(`${title}.md`, content);
        break;
        
      case 'pdf':
        alert('PDF export would be implemented with a library like jsPDF');
        break;
        
      case 'txt':
        this.downloadFile(`${title}.txt`, content);
        break;
    }
    
    this.isShareMenuOpen = false;
  }
  
  private downloadFile(filename: string, content: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      this.saveNote();
    }
  }

}

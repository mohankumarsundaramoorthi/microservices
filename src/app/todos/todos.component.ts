import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoDataService } from '../service/todo-data.service';

export class Todo {
  constructor(
    public id: number,
    public description: string,
    public done: boolean,
    public targetDate: Date
  ) {

  }
}


@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {  

  public todos !: Todo[];
  message !: string;
  show : boolean = false;
  closeResult = '';

  // todos = [
  //   new Todo(1, 'Learn to Dance', false, new Date()),
  //   new Todo(2, 'Become and expert at angular', false, new Date()),
  //   new Todo(1, 'Visit India', false, new Date()),
  // ]

  // todos = [
  //   { id: 1, description: 'Learn to Dance' },
  //   { id: 2, description: 'Learn to Sing' },
  //   { id: 3, description: 'Learn to Fight' }
  // ]

  constructor(private todoService : TodoDataService, private router : Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.refreshTodos();
  }

  private refreshTodos() {
    // this.todoService.testStrResponse();
    this.todoService.retrieveAllTodos('in28Minutes').subscribe(
      response => {
        console.log(response);
        this.todos = response;
      }
    );
  }

  deleteTodo(id : any) {
    this.todoService.deleteTodo('Alex', id).subscribe(response => {
      console.log(response);
      this.message = `Delete of ${id} is successful`; 
      this.refreshTodos();
    });
    console.log(`delete todo ${id}`);
  }

  updateTodo(id : number) {
    this.router.navigate(['todos',id])
    console.log(`udpate todo of ${id}`);
  }

  addTodo(){
    this.router.navigate(['todos',-1]);
  }

  open(content : TemplateRef<any>, id:any) {
    this.modalService.open(content, { centered: true }).result.then((result) => {
      
      this.deleteTodo(id);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}

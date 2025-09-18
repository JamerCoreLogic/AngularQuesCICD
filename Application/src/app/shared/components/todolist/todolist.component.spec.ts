import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodolistComponent } from './todolist.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TodoListService } from '@agenciiq/aqtodo';
import { AQUserInfo, AQAgentInfo, AQAgencyInfo } from '@agenciiq/login';
import { LoaderService } from '../../utility/loader/loader.service';
import { AQSession } from 'src/app/global-settings/session-storage';
import { TransactionCodeMaster } from 'src/app/global-settings/transactionCodeList';

describe('TodolistComponent', () => {
  let component: TodolistComponent;
  let fixture: ComponentFixture<TodolistComponent>;
  let mockTodoListService: any;
  let mockRouter: any;
  let mockUserInfo: any;
  let mockAgentInfo: any;
  let mockSession: any;

  beforeEach(async () => {
    mockTodoListService = {
      todo_list: jasmine.createSpy('todo_list').and.returnValue(of({ data: { toDoLists: [{ id: 1, name: 'Test' }] } }))
    };

    mockUserInfo = { UserId: () => 'user123' };
    mockAgentInfo = { Agent: () => ({ agentId: 'agent123' }) };
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockSession = { setData: jasmine.createSpy('setData') };

    await TestBed.configureTestingModule({
      declarations: [TodolistComponent],
      providers: [
        { provide: TodoListService, useValue: mockTodoListService },
        { provide: AQUserInfo, useValue: mockUserInfo },
        { provide: AQAgentInfo, useValue: mockAgentInfo },
        { provide: AQAgencyInfo, useValue: {} },
        { provide: LoaderService, useValue: {} },
        { provide: Router, useValue: mockRouter },
        { provide: AQSession, useValue: mockSession },
        { provide: TransactionCodeMaster, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodolistComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch todo list and update todoLists array', () => {
    component.getTodoList();
    expect(mockTodoListService.todo_list).toHaveBeenCalled();
    expect(component.todoLists.length).toBeGreaterThan(0);
    expect(component.IsNoRecordFound).toBeFalse();
  });

  it('should handle error in getTodoList', () => {
    mockTodoListService.todo_list.and.returnValue(throwError(() => new Error('Network error')));
    component.getTodoList();
    expect(component.IsNoRecordFound).toBeTrue();
  });

  it('should navigate to workbook with correct quoteId in todoView', () => {
    const quote = { quoteId: 'quote123' };
    component.todoView(quote);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['agenciiq/workbook']);
  });

  it('should emit toggleTodoExpand event on resize', () => {
    spyOn(component.toggleTodoExpand, 'emit');
    component.onResize(true);
    expect(component.toggleTodoExpand.emit).toHaveBeenCalledWith(true);
  });
});

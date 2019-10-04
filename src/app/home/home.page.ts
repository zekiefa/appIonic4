import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, ActionSheetController } from '@ionic/angular';
import { Item } from './item.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  tasks: Item[] = [];

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private actionShhetController: ActionSheetController
  ) { 
    let tasksJSON = localStorage.getItem('tasksDb');

    if (tasksJSON) {
      this.tasks = JSON.parse(tasksJSON);
    }
  }

  ngOnInit(): void {
  }

  async showAdd(): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'O que deseja fazer?',
      inputs: [
        {
          name: 'taskToDo',
          type: 'text',
          placeholder: 'Comprar pão'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm cancel');
          }
        },
        {
          text: 'Adicionar',
          handler: (form) => {
            this.add(form.taskToDo);
          }
        }
      ]
    });

    await alerta.present();
    return;
  }

  async add(taskToDo: string): Promise<void> {
    if (taskToDo.trim().length < 1) {
      const toast = await this.toastController.create({
        message: 'Informe o que deseja fazer',
        duration: 2000,
        position: 'top'
      });

      toast.present();
      return;
    }

    let task: Item = {name: taskToDo, done: false};
    
    this.tasks.push(task);
  }

  async openActions(task: Item): Promise<void> {
    const actionSheet = await this.actionShhetController.create({
      header: "O QUE DESEJA FAZER?",
      buttons: [{
        text: task.done ? 'Desmarcar' : 'Marcar',
        icon: task.done ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          task.done = !task.done;

          this.updateLocalStorage();
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Canceled');
        }
      }]
    });

    await actionSheet.present();
  }

  private updateLocalStorage(): void {
    localStorage.setItem('tasksDb', JSON.stringify(this.tasks));
  }
  
  delete(task: Item): void {
    this.tasks = this.tasks.filter(taskArray => task != taskArray);

    this.updateLocalStorage();
  }
}

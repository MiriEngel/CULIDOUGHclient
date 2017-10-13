import { Routes } from '@angular/router';
import { ArticlesComponent } from './articles.component';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';


export const ArticlesRoutes: Routes = [{
  path: 'articles',
  component: ArticlesComponent,
  children: [
  {path: '', component: ListComponent},
  {path:':searchStr/list', component: ListComponent},
	{path: 'create', component: CreateComponent},
	{path: ':articleId', component: ViewComponent},
	{path: ':articleId/edit', component: CreateComponent},
   ],
}];

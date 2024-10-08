import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SharedModule } from '../shared.module';
import { TestPreviewComponent } from './test-preview/test-preview.component';
import { StaticBreadcrumbComponent } from './static-breadcrumb/static-breadcrumb.component';

@NgModule({
  declarations: [ BreadcrumbComponent, TestPreviewComponent, StaticBreadcrumbComponent],
  imports: [SharedModule],
  exports: [BreadcrumbComponent,StaticBreadcrumbComponent],
})
export class ComponentsModule {}

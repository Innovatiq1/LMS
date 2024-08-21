import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SharedModule } from '../shared.module';
import { TestPreviewComponent } from './test-preview/test-preview.component';

@NgModule({
  declarations: [ BreadcrumbComponent, TestPreviewComponent],
  imports: [SharedModule],
  exports: [BreadcrumbComponent],
})
export class ComponentsModule {}

import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SharedModule } from '../shared.module';
import { TestPreviewComponent } from './test-preview/test-preview.component';
import { StaticBreadcrumbComponent } from './static-breadcrumb/static-breadcrumb.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { ScormPkgCreateComponent } from './scorm-pkg-create/scorm-pkg-create.component';

@NgModule({
  declarations: [ BreadcrumbComponent, TestPreviewComponent, StaticBreadcrumbComponent, ActivityLogComponent, ScormPkgCreateComponent],
  imports: [SharedModule],
  exports: [BreadcrumbComponent,StaticBreadcrumbComponent],
})
export class ComponentsModule {}

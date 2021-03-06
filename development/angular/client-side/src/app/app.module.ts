import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserViewComponent } from './user-view/user-view.component';
import { StudengtAttendanceComponent } from './student-attendance/student-attendance.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TeacherAttendanceComponent } from './teacher-attendance/teacher-attendance.component';
import { SemViewComponent } from './sem-view/sem-view.component';
import { CrcReportComponent } from './crc-report/crc-report.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatSortModule } from '@angular/material';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchoolInfrastructureComponent } from './school-infrastructure/school-infrastructure.component';
import { InfraMapVisualisationComponent } from './infra-map-visualisation/infra-map-visualisation.component';
import { KeycloakSecurityService } from './keycloak-security.service';
import { HomePageComponent } from './home-page/home-page.component';
import { DikshaChartComponent } from './diksha-chart/diksha-chart.component';
import { DikshaTableComponent } from './diksha-table/diksha-table.component';
import { SemesterExceptionComponent } from './semester-exception/semester-exception.component';
import { TelemetryDataComponent } from './telemetry-data/telemetry-data.component';
import { DikshaBarChartComponent } from './diksha-bar-chart/diksha-bar-chart.component';
import { MissingDataComponent } from './missing-data/missing-data.component';

export function kcFactory(kcSecurity: KeycloakSecurityService) {
  return () => kcSecurity.init();
}

@NgModule({
  declarations: [
    AppComponent,
    UserViewComponent,
    StudengtAttendanceComponent,
    HomeComponent,
    TeacherAttendanceComponent,
    SemViewComponent,
    CrcReportComponent,
    ChangePasswordComponent,
    ComingSoonComponent,
    DashboardComponent,
    SchoolInfrastructureComponent,
    InfraMapVisualisationComponent,
    HomePageComponent,
    DikshaChartComponent,
    DikshaTableComponent,
    SemesterExceptionComponent,
    TelemetryDataComponent,
    DikshaBarChartComponent,
    MissingDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    FormsModule,
    ChartsModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakSecurityService],
      useFactory: kcFactory,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

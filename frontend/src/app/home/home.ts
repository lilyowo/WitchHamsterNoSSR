import { Component, ChangeDetectionStrategy,  ChangeDetectorRef} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class Home {
  constructor(private cdr: ChangeDetectorRef) {
  }
  isMusicPlaying = false;

  toggleMusic() {
    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (!audio) return;
    console.log("toggle music");
    if (this.isMusicPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    this.isMusicPlaying = !this.isMusicPlaying;
  }

}

class NotificationService {
  private audioContext: AudioContext | null = null;
  private eventSource: EventSource | null = null;
  private isInitialized = false;

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'audio:', error);
    }
  }

  public playNotificationSound() {
    if (!this.audioContext) {
      this.initAudio();
      return;
    }

    try {
      const now = this.audioContext.currentTime;
      
      // Créer un son plus bruyant avec des fréquences plus aiguës
      const frequencies = [800, 1000, 1200, 1500]; // Fréquences plus aiguës et bruyantes
      const duration = 1.2; // Plus long pour être plus remarqué
      
      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);
        
        oscillator.frequency.setValueAtTime(freq, now);
        oscillator.type = 'square'; // Son plus bruyant et perçant
        
        // Volume plus élevé et constant
        const volume = 0.6 - (index * 0.1); // Volume beaucoup plus élevé
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        // Démarrer immédiatement pour un effet plus bruyant
        oscillator.start(now + (index * 0.05));
        oscillator.stop(now + duration);
      });
      
      // Ajouter un son de cloche aigu pour plus d'attention
      const bellOscillator = this.audioContext!.createOscillator();
      const bellGain = this.audioContext!.createGain();
      
      bellOscillator.connect(bellGain);
      bellGain.connect(this.audioContext!.destination);
      
      bellOscillator.frequency.setValueAtTime(2000, now); // Fréquence très aiguë
      bellOscillator.type = 'sawtooth'; // Son très perçant
      
      bellGain.gain.setValueAtTime(0.8, now); // Volume très élevé
      bellGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      
      bellOscillator.start(now + 0.3);
      bellOscillator.stop(now + 1.1);
      
    } catch (error) {
      console.error('Erreur lors de la lecture du son:', error);
    }
  }

  public startListeningForOrders() {
    if (this.isInitialized) return;

    try {
      // Utiliser Server-Sent Events pour écouter les nouvelles commandes
      this.eventSource = new EventSource(`${process.env.REACT_APP_API_URL || 'http://localhost:4000/api'}/orders/notifications`);
      
      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'new_order') {
          this.playNotificationSound();
          this.showNotification('Nouvelle commande !', `Commande #${data.orderId} passée par le caissier`);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('Erreur de connexion SSE:', error);
        // Reconnecter après 5 secondes
        setTimeout(() => {
          this.startListeningForOrders();
        }, 5000);
      };

      this.isInitialized = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des notifications:', error);
    }
  }

  public stopListening() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isInitialized = false;
    }
  }

  private showNotification(title: string, body: string) {
    // Vérifier si les notifications sont supportées
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      });
    }
  }

  public requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}

// Instance singleton
export const notificationService = new NotificationService();

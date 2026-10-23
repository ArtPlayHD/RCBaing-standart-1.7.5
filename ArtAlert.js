//div id == app
      // --- 1. Создаём стили через JS (вместо <style>) ---
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        :root {
          --bg: #f5f7fa;
          --card: #ffffff;
          --primary: #4f46e5;
          --danger: #ef4444;
          --success: #10b981;
          --text: #111827;
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        }
        body {
          font-family: var(--font-family);
          background: var(--bg);
          color: var(--text);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          margin: 0;
          gap: 1.5rem;
        }
        h1 { margin: 0; font-size: 1.8rem; }
        #app .container {
          background: var(--card);
          padding: 2rem;
          border-radius: 16px;
          box-shadow: var(--shadow);
          max-width: 600px;
          width: 100%;
        }
        #app .gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }
        #app .img-card {
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          background: #eef2ff;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        #app .img-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 12px rgba(0,0,0,0.15);
        }
        #app .img-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        #app .actions {
          margin-top: 1.5rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        #app button {
          padding: 0.75rem 1.25rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        #app button:active { transform: scale(0.98); }
        #app .btn-primary { background: var(--primary); color: white; }
        #app .btn-danger { background: var(--danger); color: white; }
        #app .btn-outline {
          background: transparent;
          border: 1px solid #d1d5db;
          color: var(--text);
        }
        /* Модальное окно */
        #modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
        }
        #modal {
          background: white;
          padding: 1.5rem 2rem;
          border-radius: 12px;
          min-width: 320px;
          max-width: 480px;
          box-shadow: var(--shadow);
          animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes popIn {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        #modal h2 { margin-top: 0; }
        #modal p { color: #374151; }
        #modal input {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          margin: 1rem 0;
          box-sizing: border-box;
        }
        #modal .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
        #modal button { padding: 0.5rem 1rem; }
      `;
      document.head.appendChild(styleSheet);

      // --- 2. DOM-элементы (каркас) ---
      const app = document.getElementById('app');
      app.innerHTML = `
        <h1>Библиотека: диалоги и арт (JS-only стиль)</h1>
        <div class="container">
          <p>Нажми кнопки ниже — увидишь кастомные диалоги и галерею.</p>
          <div class="gallery" id="gallery"></div>
          <div class="actions">
            <button class="btn-primary" id="btn-alert">Показать Alert</button>
            <button class="btn-outline" id="btn-confirm">Confirm: удалить книгу?</button>
            <button class="btn-outline" id="btn-prompt">Prompt: добавить описание</button>
            <button class="btn-danger" id="btn-art">Сгенерировать арт</button>
          </div>
        </div>

        <!-- Модальное окно (создано в DOM, стили — в JS) -->
        <div id="modal-overlay">
          <div id="modal">
            <h2 id="modal-title">Заголовок</h2>
            <p id="modal-message">Сообщение</p>
            <input type="text" id="modal-input" placeholder="Введите текст..." style="display:none" />
            <div class="modal-actions">
              <button class="btn-outline" id="modal-cancel">Отмена</button>
              <button class="btn-primary" id="modal-confirm">OK</button>
            </div>
          </div>
        </div>
      `;

      // --- 3. Библиотека Dialog (кастомные alert/confirm/prompt) ---
      const Dialog = {
        _resolve: null,
        _type: null,

        show(title, message, type = 'alert', defaultValue = '') {
          const overlay = document.getElementById('modal-overlay');
          const modal = document.getElementById('modal');
          const tTitle = document.getElementById('modal-title');
          const tMsg = document.getElementById('modal-message');
          const inp = document.getElementById('modal-input');
          const btnCancel = document.getElementById('modal-cancel');
          const btnConfirm = document.getElementById('modal-confirm');

          tTitle.textContent = title;
          tMsg.textContent = message;

          inp.style.display = type === 'prompt' ? 'block' : 'none';
          if (type === 'prompt') inp.value = defaultValue || '';

          overlay.style.display = 'flex';

          return new Promise((resolve) => {
            this._resolve = resolve;
            this._type = type;

            btnConfirm.onclick = () => {
              if (type === 'prompt') {
                resolve(inp.value);
              } else {
                resolve(true);
              }
              overlay.style.display = 'none';
            };

            btnCancel.onclick = () => {
              resolve(type === 'prompt' ? null : false);
              overlay.style.display = 'none';
            };
          });
        },

        alert: (message, title = 'Внимание') => this.show(title, message, 'alert'),
        confirm: (message, title = 'Подтверждение') => this.show(title, message, 'confirm'),
        prompt: (message, defaultValue = '', title = 'Ввод данных') =>
          this.show(title, message, 'prompt', defaultValue),
      };

      // --- 4. Обработчики кнопок ---
      document.getElementById('btn-alert').onclick = async () => {
        await Dialog.alert('Добро пожаловать в библиотеку! Здесь уютно и тихо. 📖');
      };

      document.getElementById('btn-confirm').onclick = async () => {
        const confirmed = await Dialog.confirm('Вы действительно хотите удалить эту книгу из списка?');
        if (confirmed) {
          await Dialog.alert('Книга удалена.');
        } else {
          console.log('Отмена');
        }
      };

      document.getElementById('btn-prompt').onclick = async () => {
        const text = await Dialog.prompt('Добавьте описание для книги:', '', 'Описание книги');
        if (text !== null) {
          await Dialog.alert(`Описание сохранено: "${text}"`);
        }
      };

      document.getElementById('btn-art').onclick = async () => {
        const extra = await Dialog.prompt(
          'Добавьте пару слов для стиля (например: "аниме", "винтаж", "киберпанк")',
          '',
          'Стиль для арта'
        );

        let basePrompt =
          'Нарисуй уютную библиотеку: высокие деревянные полки, тёплый свет лампы, раскрытая книга на столе, чашка чая. Атмосфера спокойствия. Стиль — акварель, мягкие переходы, приглушённые тёплые тона, высокая детализация.';

        if (extra && extra.trim()) {
          basePrompt += ` Добавь элементы в стиле "${extra}".`;
        }

        await Dialog.alert('Промпт для генерации:\n\n' + basePrompt);

        // Добавляем новую картинку в галерею
        const gallery = document.getElementById('gallery');
        const newCard = document.createElement('div');
        newCard.className = 'img-card';
        const img = document.createElement('img');
        img.src = 'https://images.unsplash.com/photo-1506117287730-9b0988a18191?auto=format&fit=crop&w=400&q=80';
        img.alt = 'арт-библиотека';
        newCard.appendChild(img);
        gallery.prepend(newCard);
      };

      // --- 5. Галерея с картинками (JS-only) ---
      const gallery = document.getElementById('gallery');
      const images = [
        'https://images.unsplash.com/photo-1507806917427-088577b0a4b1?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1583674541405-4fb360732436?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1533738363-b7f4a0db8d1b?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1612171768748-81d7b115a1c6?auto=format&fit=crop&w=400&q=80',
      ];

      images.forEach((src) => {
        const card = document.createElement('div');
        card.className = 'img-card';
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'библиотека';
        card.appendChild(img);
        gallery.appendChild(card);
      });

